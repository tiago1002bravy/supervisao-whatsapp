import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../whatsapp/entities/message.entity';
import { AlertasController } from './alertas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  controllers: [AlertasController],
})
export class AlertasModule {}
