import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientsService } from '../clients/clients.service';
import { UazapiWebhookDto } from './dto/uazapi-webhook.dto';
import { Message } from './entities/message.entity';

interface ZappfyChat {
  id: string;
  name?: string;
  unreadCount?: number;
}

interface ZappfyMessage {
  id?: string;
  messageid?: string;
  fromMe?: boolean;
  sender?: string;
  senderName?: string;
  text?: string;
  body?: string;
  messageTimestamp?: number;
  messageType?: string;
  type?: string;
}

export interface PrivateChat {
  chatId: string;
  name?: string;
  unreadCount: number;
  messages: {
    id?: string;
    fromMe: boolean;
    sender?: string;
    content: string;
    sentAt: Date | null;
    type: string;
  }[];
}

type IngestResult = 'saved' | 'duplicate' | 'ignored';

const AUDIO_MEDIA_TYPES = ['ptt', 'audio', 'myaudio'];

// messageType values for media that should be saved with a label even without text
const MEDIA_MESSAGE_TYPES: Record<string, string> = {
  imageMessage: '[Imagem]',
  videoMessage: '[Vídeo]',
  documentMessage: '[Documento]',
  stickerMessage: '[Figurinha]',
};

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    private readonly clientsService: ClientsService,
    private readonly configService: ConfigService,
  ) {}

  async ingestWebhook(dto: UazapiWebhookDto): Promise<IngestResult> {
    const msg = dto.message;

    if (dto.EventType !== 'messages') {
      return 'ignored';
    }

    if (!msg?.isGroup) {
      return 'ignored';
    }

    const mediaType = msg.mediaType ?? '';
    const messageType = msg.messageType ?? '';

    const isAudio = AUDIO_MEDIA_TYPES.includes(mediaType) ||
      AUDIO_MEDIA_TYPES.includes(messageType);

    let content: string;

    if (isAudio) {
      content = '[Áudio]';
    } else {
      const extracted = this.extractContent(dto);
      if (!extracted) {
        return 'ignored';
      }
      content = extracted;
    }

    const chatid = msg.chatid;
    const client = chatid
      ? await this.clientsService.findByGroupId(chatid)
      : null;

    const messageId = msg.messageid ?? msg.id ?? `${chatid}-${msg.messageTimestamp}`;
    const senderPhone = (msg.sender_pn ?? msg.sender ?? 'unknown').split('@')[0];
    const sentAt = msg.messageTimestamp
      ? new Date(msg.messageTimestamp)
      : new Date();

    const result = await this.messageRepo
      .createQueryBuilder()
      .insert()
      .into(Message)
      .values({
        clientId: client?.id ?? undefined,
        messageId,
        content,
        isAudio,
        senderName: msg.senderName ?? undefined,
        senderPhone,
        sentAt,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rawPayload: JSON.parse(JSON.stringify(dto)) as any,
      })
      .orIgnore()
      .execute();

    const affected = result.raw?.length ?? result.identifiers.length;
    if (affected > 0) {
      this.logger.log(`Saved message from ${msg.senderName ?? senderPhone} in ${chatid} [${messageType || mediaType || 'text'}]`);
      return 'saved';
    }
    return 'duplicate';
  }

  /**
   * Extracts human-readable content for non-audio messages.
   * Returns null only if the message has no meaningful content to store.
   */
  private extractContent(dto: UazapiWebhookDto): string | null {
    const msg = dto.message;
    if (!msg) return null;

    const messageType = msg.messageType ?? '';
    const mediaType = msg.mediaType ?? '';

    // Reaction: "[Reação: 👍]"
    if (messageType === 'reactionMessage') {
      const emoji = msg.text ?? (msg.content?.text as string | undefined);
      return emoji ? `[Reação: ${emoji}]` : '[Reação]';
    }

    // Known media types: label + optional caption
    const mediaLabel =
      MEDIA_MESSAGE_TYPES[messageType] ??
      (mediaType === 'image' ? '[Imagem]' :
        mediaType === 'video' ? '[Vídeo]' :
          mediaType === 'document' ? '[Documento]' :
            mediaType === 'sticker' ? '[Figurinha]' : null);

    if (mediaLabel) {
      const caption = msg.text ?? msg.content?.text;
      return caption ? `${mediaLabel} ${caption}` : mediaLabel;
    }

    // Plain text or text with reply/link preview (conversation, ExtendedTextMessage, etc.)
    return msg.text ?? msg.content?.text ?? null;
  }

  async getPrivateChats(instanceToken: string): Promise<PrivateChat[]> {
    const baseUrl = this.configService.get<string>('UAZAPI_BASE_URL');
    const headers = { 'Content-Type': 'application/json', token: instanceToken };

    // 1. Lista todos os chats da instância
    const chatsRes = await fetch(`${baseUrl}/chat/all`, { headers });
    if (!chatsRes.ok) {
      throw new Error(`Zappfy /chat/all falhou: ${chatsRes.status} ${chatsRes.statusText}`);
    }
    const chatsData = (await chatsRes.json()) as ZappfyChat[];
    const chats = Array.isArray(chatsData) ? chatsData : (chatsData as any).chats ?? [];

    // 2. Filtra apenas conversas privadas (não grupos)
    const privateChats = chats.filter((c: ZappfyChat) => c.id?.endsWith('@c.us'));

    // 3. Para cada conversa, busca as últimas mensagens
    const results: PrivateChat[] = await Promise.all(
      privateChats.map(async (chat: ZappfyChat) => {
        try {
          const msgsRes = await fetch(`${baseUrl}/message/findMessages`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ chatid: chat.id, limit: 50 }),
          });
          const msgsData = msgsRes.ok ? await msgsRes.json() : [];
          const messages: ZappfyMessage[] = Array.isArray(msgsData)
            ? msgsData
            : (msgsData as any).messages ?? [];
          return {
            chatId: chat.id,
            name: chat.name ?? chat.id?.split('@')[0],
            unreadCount: chat.unreadCount ?? 0,
            messages: messages.map((m: ZappfyMessage) => ({
              id: m.id ?? m.messageid,
              fromMe: m.fromMe ?? false,
              sender: m.senderName ?? m.sender?.split('@')[0],
              content: m.text ?? m.body ?? '',
              sentAt: m.messageTimestamp
                ? new Date(
                    m.messageTimestamp > 1e10
                      ? m.messageTimestamp
                      : m.messageTimestamp * 1000,
                  )
                : null,
              type: m.messageType ?? m.type ?? 'text',
            })),
          };
        } catch {
          return { chatId: chat.id, name: chat.name ?? chat.id?.split('@')[0], unreadCount: 0, messages: [] };
        }
      }),
    );

    return results.sort((a, b) => b.unreadCount - a.unreadCount);
  }

}
