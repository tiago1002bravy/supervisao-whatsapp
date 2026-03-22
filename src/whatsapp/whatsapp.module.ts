import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '../clients/clients.module';
import { WebhookController } from './webhook.controller';
import { MessagesController } from './messages.controller';
import { WhatsappService } from './whatsapp.service';
import { Message } from './entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), ClientsModule],
  controllers: [WebhookController, MessagesController],
  providers: [WhatsappService],
})
export class WhatsappModule {}
