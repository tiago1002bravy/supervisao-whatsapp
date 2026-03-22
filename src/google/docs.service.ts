import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { GoogleAuthService } from './google-auth.service';
import { docs_v1 } from 'googleapis';

@Injectable()
export class DocsService {
  constructor(private readonly authService: GoogleAuthService) {}

  async extractText(docId: string): Promise<string> {
    const auth = await this.authService.getAuthenticatedClient();
    const docs = google.docs({ version: 'v1', auth });

    const response = await docs.documents.get({
      documentId: docId,
      fields: 'body.content',
    });

    const content = response.data.body?.content ?? [];
    let text = this.extractFromContent(content);

    // Replace vertical tab (soft newline in Docs) with newline
    text = text.replace(/\u000b/g, '\n');

    // Collapse 3+ consecutive newlines to 2
    text = text.replace(/\n{3,}/g, '\n\n');

    return text.trim();
  }

  private extractFromContent(
    content: docs_v1.Schema$StructuralElement[],
  ): string {
    let text = '';

    for (const element of content) {
      if (element.paragraph) {
        const elements = element.paragraph.elements ?? [];
        for (const el of elements) {
          if (el.textRun?.content) {
            text += el.textRun.content;
          }
        }
      } else if (element.table) {
        const rows = element.table.tableRows ?? [];
        for (const row of rows) {
          const cells = row.tableCells ?? [];
          for (const cell of cells) {
            const cellContent = cell.content ?? [];
            text += this.extractFromContent(cellContent);
          }
        }
      }
    }

    return text;
  }
}
