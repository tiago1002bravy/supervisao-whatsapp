import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { Repository } from 'typeorm';
import { DriveService } from './drive.service';
import { GoogleAuthService } from './google-auth.service';
import { GoogleSyncDocument } from './entities/google-sync-document.entity';

describe('DriveService', () => {
  const folderMimeType = 'application/vnd.google-apps.folder';
  const docMimeType = 'application/vnd.google-apps.document';

  let service: DriveService;
  let authService: jest.Mocked<GoogleAuthService>;
  let configService: jest.Mocked<ConfigService>;
  let repo: jest.Mocked<Repository<GoogleSyncDocument>>;

  beforeEach(() => {
    authService = {
      getAuthenticatedClient: jest.fn().mockResolvedValue({}),
    } as unknown as jest.Mocked<GoogleAuthService>;

    configService = {
      get: jest.fn().mockReturnValue('team-root-folder'),
    } as unknown as jest.Mocked<ConfigService>;

    repo = {
      find: jest.fn().mockResolvedValue([]),
      upsert: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<Repository<GoogleSyncDocument>>;

    service = new DriveService(authService, configService, repo);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('discovers Google Docs inside meet records folders recursively', async () => {
    const list = jest
      .fn()
      .mockResolvedValueOnce({
        data: {
          files: [{ id: 'person-folder', name: 'Alice', mimeType: folderMimeType }],
        },
      })
      .mockResolvedValueOnce({
        data: {
          files: [
            { id: 'meet-folder', name: 'meet records', mimeType: folderMimeType },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          files: [
            {
              id: 'doc-1',
              name: 'Weekly sync',
              mimeType: docMimeType,
              createdTime: '2026-03-17T10:00:00.000Z',
              modifiedTime: '2026-03-17T11:00:00.000Z',
            },
          ],
        },
      });

    jest.spyOn(google, 'drive').mockReturnValue({
      files: { list },
    } as never);

    const result = await service.pollTeamMeetRecords();

    expect(result.meet_records_folders).toBe(1);
    expect(result.docs).toEqual([
      {
        doc_id: 'doc-1',
        doc_title: 'Weekly sync',
        created_time: '2026-03-17T10:00:00.000Z',
        modified_time: '2026-03-17T11:00:00.000Z',
        source_folder_id: 'meet-folder',
        source_folder_name: 'meet records',
        source_path: '/Alice/meet records',
        status: 'new',
      },
    ]);
    expect(repo.upsert).toHaveBeenCalledTimes(1);
  });

  it('does not report unchanged documents as updates', async () => {
    const list = jest
      .fn()
      .mockResolvedValueOnce({
        data: {
          files: [
            { id: 'person-folder', name: 'Alice', mimeType: folderMimeType },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          files: [
            { id: 'meet-folder', name: 'meet records', mimeType: folderMimeType },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          files: [
            {
              id: 'doc-1',
              name: 'Weekly sync',
              mimeType: docMimeType,
              createdTime: '2026-03-17T10:00:00.000Z',
              modifiedTime: '2026-03-17T11:00:00.000Z',
            },
          ],
        },
      });

    repo.find.mockResolvedValue([
      {
        googleFileId: 'doc-1',
        docTitle: 'Weekly sync',
        sourceFolderId: 'meet-folder',
        sourceFolderName: 'meet records',
        sourcePath: '/Alice/meet records',
        createdTime: new Date('2026-03-17T10:00:00.000Z'),
        modifiedTime: new Date('2026-03-17T11:00:00.000Z'),
      } as GoogleSyncDocument,
    ]);

    jest.spyOn(google, 'drive').mockReturnValue({
      files: { list },
    } as never);

    const result = await service.pollTeamMeetRecords();

    expect(result.docs).toEqual([]);
    expect(repo.upsert).toHaveBeenCalledTimes(1);
  });
});
