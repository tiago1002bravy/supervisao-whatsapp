import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWT } from 'googleapis-common';

const SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/documents.readonly',
];

@Injectable()
export class GoogleAuthService {
  constructor(private readonly config: ConfigService) {}

  async getAuthenticatedClient(): Promise<JWT> {
    const keyJson = this.config.get<string>('GOOGLE_SERVICE_ACCOUNT_KEY');
    if (!keyJson) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not configured');
    }

    const impersonateEmail = this.config.get<string>('GOOGLE_IMPERSONATE_EMAIL');
    if (!impersonateEmail) {
      throw new Error('GOOGLE_IMPERSONATE_EMAIL is not configured');
    }

    const key = JSON.parse(keyJson);

    const client = new JWT({
      email: key.client_email,
      key: key.private_key,
      scopes: SCOPES,
      subject: impersonateEmail,
    });

    await client.authorize();
    return client;
  }
}
