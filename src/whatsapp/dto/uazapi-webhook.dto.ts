import { IsOptional, IsString } from 'class-validator';

class WebhookMessageContent {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  contextInfo?: Record<string, unknown>;
}

class WebhookMessage {
  @IsOptional()
  @IsString()
  chatid?: string;

  @IsOptional()
  messageid?: string;

  @IsOptional()
  @IsString()
  sender?: string;

  @IsOptional()
  @IsString()
  sender_pn?: string;

  @IsOptional()
  @IsString()
  senderName?: string;

  @IsOptional()
  messageTimestamp?: number;

  @IsOptional()
  @IsString()
  messageType?: string;

  @IsOptional()
  fromMe?: boolean;

  @IsOptional()
  isGroup?: boolean;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  content?: WebhookMessageContent;

  @IsOptional()
  @IsString()
  mediaType?: string;

  @IsOptional()
  @IsString()
  id?: string;

  // ID of the quoted/replied message
  @IsOptional()
  @IsString()
  quoted?: string;

  // For reaction messages: ID of the message being reacted to
  @IsOptional()
  @IsString()
  reaction?: string;
}

export class UazapiWebhookDto {
  @IsOptional()
  @IsString()
  EventType?: string;

  @IsOptional()
  message?: WebhookMessage;

  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsString()
  instanceName?: string;
}
