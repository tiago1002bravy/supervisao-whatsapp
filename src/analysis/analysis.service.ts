import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Message } from '../whatsapp/entities/message.entity';
import { RiskReport } from './entities/risk-report.entity';

const SYSTEM_PROMPT = `
TODO: inserir system prompt aqui
`.trim();

@Injectable()
export class AnalysisService {
  private readonly logger = new Logger(AnalysisService.name);

  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(RiskReport)
    private readonly riskReportRepo: Repository<RiskReport>,
    private readonly dataSource: DataSource,
    private readonly config: ConfigService,
  ) {}

  @Cron('0 */30 * * * *')
  async runAnalysis(): Promise<void> {
    const unanalyzed = await this.messageRepo
      .createQueryBuilder('m')
      .select('DISTINCT m.client_id', 'clientId')
      .where('m.analyzed = false')
      .getRawMany<{ clientId: string }>();

    if (unanalyzed.length === 0) {
      return;
    }

    this.logger.log('Analysis started');

    let processed = 0;

    for (const { clientId } of unanalyzed) {
      try {
        await this.analyzeClient(clientId);
        processed++;
      } catch (err) {
        this.logger.error(
          `Failed to analyze client ${clientId}: ${(err as Error).message}`,
        );
      }
    }

    this.logger.log(`Analysis complete: ${processed} client(s) processed`);
  }

  private async analyzeClient(clientId: string): Promise<void> {
    const messages = await this.messageRepo.find({
      where: { clientId, analyzed: false },
      relations: ['client'],
      order: { sentAt: 'ASC' },
    });

    if (messages.length === 0) return;

    const clientName = messages[0].client?.name ?? clientId;
    const formatted = this.formatMessages(messages);

    const gptResponse = await this.callGpt(formatted);

    let riskScore: number | undefined;
    let content = gptResponse;

    try {
      const parsed = JSON.parse(gptResponse) as Record<string, unknown>;
      if (typeof parsed['risk_score'] === 'number') {
        riskScore = parsed['risk_score'];
      }
    } catch {
      // not JSON — store raw content, riskScore stays undefined
    }

    const messageIds = messages.map((m) => m.id);

    await this.dataSource.transaction(async (manager) => {
      const report = manager.create(RiskReport, {
        clientId,
        content,
        riskScore,
        messagesCount: messages.length,
      });
      await manager.save(RiskReport, report);

      await manager.update(Message, { id: In(messageIds) }, { analyzed: true });
    });

    this.logger.log(
      `Client "${clientName}": ${messages.length} messages → risk_score: ${riskScore ?? 'n/a'}`,
    );
  }

  private formatMessages(messages: Message[]): string {
    return messages
      .map((m) => {
        const date = m.sentAt.toISOString().replace('T', ' ').slice(0, 16);
        const sender = m.senderName ?? m.senderPhone;
        return `[${date}] ${sender}: ${m.content}`;
      })
      .join('\n');
  }

  private async callGpt(formattedMessages: string): Promise<string> {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');

    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.5',
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: formattedMessages },
          ],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as {
      choices: { message: { content: string } }[];
    };

    return data.choices[0].message.content;
  }
}
