import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from '../../whatsapp/entities/message.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ name: 'whatsapp_group_id', type: 'varchar', unique: true })
  whatsappGroupId!: string;

  @Column({ name: 'clickup_list_id', type: 'varchar', nullable: true })
  clickupListId?: string;

  @Column({ name: 'alert_whatsapp_number', type: 'varchar', nullable: true })
  alertWhatsappNumber?: string;

  @Column({ name: 'risk_threshold', type: 'int', default: 50 })
  riskThreshold!: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @OneToMany(() => Message, (message) => message.client)
  messages?: Message[];
}
