import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('google_sync_documents')
@Unique(['googleFileId'])
export class GoogleSyncDocument {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'google_file_id', type: 'varchar' })
  googleFileId!: string;

  @Column({ name: 'doc_title', type: 'varchar' })
  docTitle!: string;

  @Column({ name: 'source_folder_id', type: 'varchar' })
  sourceFolderId!: string;

  @Column({ name: 'source_folder_name', type: 'varchar' })
  sourceFolderName!: string;

  @Column({ name: 'source_path', type: 'varchar' })
  sourcePath!: string;

  @Column({ name: 'created_time', type: 'timestamptz' })
  createdTime!: Date;

  @Column({ name: 'modified_time', type: 'timestamptz' })
  modifiedTime!: Date;

  @Column({ name: 'last_synced_at', type: 'timestamptz' })
  lastSyncedAt!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
