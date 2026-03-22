import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { google, drive_v3 } from 'googleapis';
import { In, Repository } from 'typeorm';
import { GoogleAuthService } from './google-auth.service';
import { GoogleSyncDocument } from './entities/google-sync-document.entity';

const GOOGLE_DOC_MIME_TYPE = 'application/vnd.google-apps.document';
const GOOGLE_FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';
const MEET_RECORDS_FOLDER_NAME = 'meet records';

export interface PolledGoogleDocInfo {
  doc_id: string;
  doc_title: string;
  created_time: string;
  modified_time: string;
  source_folder_id: string;
  source_folder_name: string;
  source_path: string;
  status: 'new' | 'updated';
}

interface QueueFolder {
  id: string;
  name: string;
  path: string;
  insideMeetRecords: boolean;
}

interface DiscoveredDoc {
  googleFileId: string;
  docTitle: string;
  sourceFolderId: string;
  sourceFolderName: string;
  sourcePath: string;
  createdTime: string;
  modifiedTime: string;
}

@Injectable()
export class DriveService {
  constructor(
    private readonly authService: GoogleAuthService,
    private readonly config: ConfigService,
    @InjectRepository(GoogleSyncDocument)
    private readonly syncDocumentRepo: Repository<GoogleSyncDocument>,
  ) {}

  async pollTeamMeetRecords(): Promise<{
    polled_at: string;
    meet_records_folders: number;
    docs: PolledGoogleDocInfo[];
  }> {
    const teamRootFolderId = this.getTeamRootFolderId();
    const auth = await this.authService.getAuthenticatedClient();
    const drive = google.drive({ version: 'v3', auth });

    const { docs, meetRecordsFolders } =
      await this.discoverDocsWithinMeetRecords(drive, teamRootFolderId);
    const changedDocs = await this.persistDiscoveredDocs(docs);

    return {
      polled_at: new Date().toISOString(),
      meet_records_folders: meetRecordsFolders,
      docs: changedDocs,
    };
  }

  private getTeamRootFolderId(): string {
    const folderId = this.config.get<string>('GOOGLE_TEAM_ROOT_FOLDER_ID');
    if (!folderId) {
      throw new Error('GOOGLE_TEAM_ROOT_FOLDER_ID is not configured');
    }

    return folderId;
  }

  private async discoverDocsWithinMeetRecords(
    drive: drive_v3.Drive,
    rootFolderId: string,
  ): Promise<{ docs: DiscoveredDoc[]; meetRecordsFolders: number }> {
    const queue: QueueFolder[] = [
      {
        id: rootFolderId,
        name: 'team-root',
        path: '',
        insideMeetRecords: false,
      },
    ];
    const seenFolders = new Set<string>([rootFolderId]);
    const docs: DiscoveredDoc[] = [];
    let meetRecordsFolders = 0;

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) {
        continue;
      }

      const children = await this.listFolderChildren(drive, current.id);
      for (const child of children) {
        if (!child.id || !child.name || !child.mimeType) {
          continue;
        }

        if (child.mimeType === GOOGLE_FOLDER_MIME_TYPE) {
          if (seenFolders.has(child.id)) {
            continue;
          }

          seenFolders.add(child.id);

          const isMeetRecordsFolder =
            child.name.trim().toLowerCase() === MEET_RECORDS_FOLDER_NAME;
          if (isMeetRecordsFolder) {
            meetRecordsFolders++;
          }

          const folderPath = `${current.path}/${child.name}`;
          queue.push({
            id: child.id,
            name: child.name,
            path: folderPath,
            insideMeetRecords: current.insideMeetRecords || isMeetRecordsFolder,
          });
          continue;
        }

        if (
          current.insideMeetRecords &&
          child.mimeType === GOOGLE_DOC_MIME_TYPE &&
          child.createdTime &&
          child.modifiedTime
        ) {
          docs.push({
            googleFileId: child.id,
            docTitle: child.name,
            sourceFolderId: current.id,
            sourceFolderName: current.name,
            sourcePath: current.path || '/',
            createdTime: child.createdTime,
            modifiedTime: child.modifiedTime,
          });
        }
      }
    }

    return { docs, meetRecordsFolders };
  }

  private async listFolderChildren(
    drive: drive_v3.Drive,
    folderId: string,
  ): Promise<drive_v3.Schema$File[]> {
    const files: drive_v3.Schema$File[] = [];
    let pageToken: string | undefined;

    do {
      const response = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields:
          'nextPageToken, files(id, name, mimeType, createdTime, modifiedTime)',
        pageSize: 1000,
        pageToken,
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
      });

      files.push(...(response.data.files ?? []));
      pageToken = response.data.nextPageToken ?? undefined;
    } while (pageToken);

    return files;
  }

  private async persistDiscoveredDocs(
    docs: DiscoveredDoc[],
  ): Promise<PolledGoogleDocInfo[]> {
    if (docs.length === 0) {
      return [];
    }

    const now = new Date();
    const existingDocs = await this.syncDocumentRepo.find({
      where: {
        googleFileId: In(docs.map((doc) => doc.googleFileId)),
      },
    });
    const existingByFileId = new Map(
      existingDocs.map((doc) => [doc.googleFileId, doc]),
    );
    const changedDocs: PolledGoogleDocInfo[] = [];

    for (const doc of docs) {
      const existing = existingByFileId.get(doc.googleFileId);
      const createdTime = new Date(doc.createdTime);
      const modifiedTime = new Date(doc.modifiedTime);

      if (!existing) {
        changedDocs.push(this.toPolledDocInfo(doc, 'new'));
        continue;
      }

      const hasChanged =
        existing.docTitle !== doc.docTitle ||
        existing.sourceFolderId !== doc.sourceFolderId ||
        existing.sourceFolderName !== doc.sourceFolderName ||
        existing.sourcePath !== doc.sourcePath ||
        existing.createdTime.toISOString() !== createdTime.toISOString() ||
        existing.modifiedTime.toISOString() !== modifiedTime.toISOString();

      if (hasChanged) {
        changedDocs.push(this.toPolledDocInfo(doc, 'updated'));
      }
    }

    await this.syncDocumentRepo.upsert(
      docs.map((doc) => ({
        googleFileId: doc.googleFileId,
        docTitle: doc.docTitle,
        sourceFolderId: doc.sourceFolderId,
        sourceFolderName: doc.sourceFolderName,
        sourcePath: doc.sourcePath,
        createdTime: new Date(doc.createdTime),
        modifiedTime: new Date(doc.modifiedTime),
        lastSyncedAt: now,
      })),
      ['googleFileId'],
    );

    return changedDocs;
  }

  private toPolledDocInfo(
    doc: DiscoveredDoc,
    status: 'new' | 'updated',
  ): PolledGoogleDocInfo {
    return {
      doc_id: doc.googleFileId,
      doc_title: doc.docTitle,
      created_time: doc.createdTime,
      modified_time: doc.modifiedTime,
      source_folder_id: doc.sourceFolderId,
      source_folder_name: doc.sourceFolderName,
      source_path: doc.sourcePath || '/',
      status,
    };
  }
}
