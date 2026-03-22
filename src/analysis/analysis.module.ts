import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../whatsapp/entities/message.entity';
import { RiskReport } from './entities/risk-report.entity';
import { AnalysisService } from './analysis.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, RiskReport])],
  providers: [AnalysisService],
})
export class AnalysisModule {}
