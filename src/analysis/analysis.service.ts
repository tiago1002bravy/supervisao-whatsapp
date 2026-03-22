import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Message } from '../whatsapp/entities/message.entity';
import { RiskReport } from './entities/risk-report.entity';

@Injectable()
export class AnalysisService {
  private readonly logger = new Logger(AnalysisService.name);

  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(RiskReport)
    private readonly riskReportRepo: Repository<RiskReport>,
    private readonly dataSource: DataSource,
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
      order: { sentAt: 'ASC' },
    });

    if (messages.length === 0) return;

    const messageIds = messages.map((m) => m.id);

    await this.dataSource.transaction(async (manager) => {
      const report = manager.create(RiskReport, {
        clientId,
        content: null,
        riskScore: undefined,
        messagesCount: messages.length,
      });
      await manager.save(RiskReport, report);

      await manager.update(Message, { id: In(messageIds) }, { analyzed: true });
    });
  }
}
