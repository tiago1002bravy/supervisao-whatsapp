import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleAuthService } from './google-auth.service';
import { DriveService } from './drive.service';
import { DocsService } from './docs.service';
import { GoogleController } from './google.controller';
import { GoogleSyncDocument } from './entities/google-sync-document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GoogleSyncDocument])],
  controllers: [GoogleController],
  providers: [GoogleAuthService, DriveService, DocsService],
  exports: [DriveService, DocsService],
})
export class GoogleModule {}
