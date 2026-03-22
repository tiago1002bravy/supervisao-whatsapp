import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '../clients/clients.module';
import { WebhookController } from './webhook.controller';
import { MessagesController } from './messages.controller';
import { WhatsappService } from './whatsapp.service';
import { WebhookSecretGuard } from '../common/guards/webhook-secret.guard';
import { Message } from './entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), ClientsModule],
  controllers: [WebhookController, MessagesController],
  providers: [WhatsappService, WebhookSecretGuard],
})
export class WhatsappModule {}
