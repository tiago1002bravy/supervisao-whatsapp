import { Controller, Get, Param, Post } from '@nestjs/common';
import { DriveService } from './drive.service';
import { DocsService } from './docs.service';

@Controller('google')
export class GoogleController {
  constructor(
    private readonly driveService: DriveService,
    private readonly docsService: DocsService,
  ) {}

  @Post('poll')
  async pollDocs() {
    return this.driveService.pollTeamMeetRecords();
  }

  @Get('docs/:docId/text')
  async getDocText(@Param('docId') docId: string) {
    const text = await this.docsService.extractText(docId);
    return { doc_id: docId, text };
  }
}
