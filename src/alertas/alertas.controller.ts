import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../whatsapp/entities/message.entity';

const CONFLICT_PATTERNS = [
  /\?\?\?\?/,                          // múltiplos ?
  /sem retorno/i,
  /sem novidades/i,
  /sem resposta/i,
  /não (me |foi |foi |foram )?respond/i,
  /não (me )?avisou/i,
  /não (me )?comunicou/i,
  /não (me )?informou/i,
  /indisponível/i,
  /não (consigo|consegui|conseguimos)/i,
  /dá erro/i,
  /aparece erro/i,
  /erro/i,
  /não (tá|está) funcionando/i,
  /não funciona/i,
  /problema/i,
  /reclamação/i,
  /insatisfeit/i,
  /cancelar/i,
  /devolver/i,
  /reembolso/i,
  /não (foi |foi )?entregue/i,
  /atrasad/i,
  /decepcionad/i,
  /prejudic/i,
];

const EMOJI_ONLY = /^[\p{Emoji}\s]+$/u;

function isConflict(content: string): boolean {
  return CONFLICT_PATTERNS.some((p) => p.test(content));
}

@Controller('alertas')
export class AlertasController {
  private readonly teamPhones: Set<string>;
  private readonly teamNames: Set<string>;

  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    private readonly config: ConfigService,
  ) {
    const phones = this.config.get<string>('TEAM_PHONES') ?? '';
    const names = this.config.get<string>('TEAM_NAMES') ?? '';
    this.teamPhones = new Set(phones.split(',').map((s) => s.trim()).filter(Boolean));
    this.teamNames = new Set(names.split(',').map((s) => s.trim()).filter(Boolean));
  }

  private isTeam(phone: string, name: string | null | undefined): boolean {
    return this.teamPhones.has(phone) || this.teamNames.has(name ?? '');
  }

  @Get('sem-resposta')
  async semResposta(@Query('min') minMinutes = '30') {
    const messages = await this.messageRepo
      .createQueryBuilder('m')
      .select([
        'm.id', 'm.senderName', 'm.senderPhone',
        'm.content', 'm.sentAt', 'm.clientId',
      ])
      .addSelect("m.raw_payload->'message'->>'chatid'", 'groupId')
      .orderBy('m.sentAt', 'ASC')
      .getRawMany();

    const groups = new Map<string, { lastClient: any; lastTeam: Date | null }>();

    for (const m of messages) {
      const gid: string = m.groupId ?? 'sem-grupo';
      const phone: string = m.m_sender_phone;
      const name: string = m.m_sender_name;
      const sentAt = new Date(m.m_sent_at);

      if (!groups.has(gid)) groups.set(gid, { lastClient: null, lastTeam: null });
      const g = groups.get(gid)!;

      if (this.isTeam(phone, name)) {
        g.lastTeam = sentAt;
      } else {
        g.lastClient = { name, phone, content: m.m_content, time: sentAt, groupId: gid };
      }
    }

    const now = new Date();
    const minMs = Number(minMinutes) * 60 * 1000;
    const result: Array<{
      cliente: string; telefone: string; grupo: string;
      ultima_mensagem: string; enviada_em: Date;
      aguardando: string; aguardando_minutos: number;
    }> = [];

    for (const [, g] of groups) {
      if (!g.lastClient) continue;
      const semResposta = !g.lastTeam || g.lastClient.time > g.lastTeam;
      if (!semResposta) continue;

      const ms = now.getTime() - g.lastClient.time.getTime();
      if (ms < minMs) continue;

      const mins = Math.floor(ms / 60000);
      const h = Math.floor(mins / 60);
      const m = mins % 60;

      if (EMOJI_ONLY.test(g.lastClient.content)) continue;

      result.push({
        cliente: g.lastClient.name,
        telefone: g.lastClient.phone,
        grupo: g.lastClient.groupId,
        ultima_mensagem: g.lastClient.content.slice(0, 100),
        enviada_em: g.lastClient.time,
        aguardando: h > 0 ? `${h}h${String(m).padStart(2, '0')}m` : `${m}min`,
        aguardando_minutos: mins,
      });
    }

    result.sort((a, b) => b.aguardando_minutos - a.aguardando_minutos);
    return { total: result.length, grupos: result };
  }

  @Get('conflitos')
  async conflitos(@Query('horas') horas = '24') {
    const since = new Date(Date.now() - Number(horas) * 3600 * 1000);

    const messages = await this.messageRepo
      .createQueryBuilder('m')
      .select([
        'm.id', 'm.senderName', 'm.senderPhone',
        'm.content', 'm.sentAt', 'm.clientId',
      ])
      .addSelect("m.raw_payload->'message'->>'chatid'", 'groupId')
      .where('m.sent_at >= :since', { since })
      .orderBy('m.sentAt', 'DESC')
      .getRawMany();

    const result: Array<{
      cliente: string; telefone: string; grupo: string;
      mensagem: string; enviada_em: Date;
    }> = [];

    for (const m of messages) {
      const phone: string = m.m_sender_phone;
      const name: string = m.m_sender_name;
      if (this.isTeam(phone, name)) continue;
      if (!isConflict(m.m_content)) continue;

      result.push({
        cliente: name,
        telefone: phone,
        grupo: m.groupId,
        mensagem: m.m_content.slice(0, 200),
        enviada_em: m.m_sent_at,
      });
    }

    return { total: result.length, conflitos: result };
  }
}
