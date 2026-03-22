import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'client_id', type: 'uuid', nullable: true })
  clientId?: string;

  @ManyToOne(() => Client, (client) => client.messages, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'client_id' })
  client?: Client;

  @Column({ name: 'message_id', type: 'varchar', unique: true })
  messageId!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ name: 'sender_name', type: 'varchar', nullable: true })
  senderName?: string;

  @Column({ name: 'sender_phone', type: 'varchar' })
  senderPhone!: string;

  @Column({ name: 'sent_at', type: 'timestamptz' })
  sentAt!: Date;

  @Column({ name: 'is_audio', type: 'boolean', default: false })
  isAudio!: boolean;

  @Column({ type: 'boolean', default: false })
  analyzed!: boolean;

  @Column({ name: 'raw_payload', type: 'jsonb', nullable: true })
  rawPayload?: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
