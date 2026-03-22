import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { WhatsappService } from './whatsapp.service';

@Controller('messages')
export class MessagesController {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    private readonly whatsappService: WhatsappService,
  ) {}

  @Get()
  async list(
    @Query('limit') limit = '50',
    @Query('group') group?: string,
    @Query('since') since?: string,
  ) {
    const qb = this.messageRepo
      .createQueryBuilder('m')
      .select([
        'm.id', 'm.senderName', 'm.senderPhone', 'm.content',
        'm.sentAt', 'm.isAudio', 'm.clientId',
      ])
      .addSelect("m.raw_payload->'message'->>'chatid'", 'groupId')
      .orderBy('m.sentAt', 'DESC')
      .limit(Math.min(Number(limit), 2000));

    const conditions: string[] = [];
    const params: Record<string, any> = {};

    if (group) {
      conditions.push("m.raw_payload->'message'->>'chatid' = :group");
      params.group = group;
    }

    if (since) {
      conditions.push('m.sent_at >= :since');
      params.since = new Date(since);
    }

    if (conditions.length) {
      qb.where(conditions.join(' AND '), params);
    }

    const raw = await qb.getRawMany();
    const total = await this.messageRepo.count();

    const messages = raw.map(r => ({
      id: r.m_id,
      senderName: r.m_sender_name,
      senderPhone: r.m_sender_phone,
      content: r.m_content,
      sentAt: r.m_sent_at,
      isAudio: r.m_is_audio,
      clientId: r.m_client_id,
      groupId: r.groupId,
    }));

    return { total, messages };
  }

  @Get('privados')
  async listPrivados(@Query('token') token?: string) {
    if (!token) {
      throw new BadRequestException('Parâmetro "token" é obrigatório (token da instância Zappfy)');
    }
    const chats = await this.whatsappService.getPrivateChats(token);
    return { total: chats.length, chats };
  }
}
