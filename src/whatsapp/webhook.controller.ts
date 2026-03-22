import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UazapiWebhookDto } from './dto/uazapi-webhook.dto';
import { WhatsappService } from './whatsapp.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('whatsapp')
  @HttpCode(200)
  async receiveWebhook(@Body() dto: UazapiWebhookDto) {
    const result = await this.whatsappService.ingestWebhook(dto);
    return { result };
  }
}
