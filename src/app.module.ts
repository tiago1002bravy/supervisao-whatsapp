import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { validate } from './config/env.validation';
import { RequestLoggingMiddleware } from './common/middleware/request-logging.middleware';
import { ClientsModule } from './clients/clients.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { GoogleModule } from './google/google.module';
import { AnalysisModule } from './analysis/analysis.module';
import { HealthModule } from './health/health.module';
import { AlertasModule } from './alertas/alertas.module';
import { Client } from './clients/entities/client.entity';
import { Message } from './whatsapp/entities/message.entity';
import { RiskReport } from './analysis/entities/risk-report.entity';
import { GoogleSyncDocument } from './google/entities/google-sync-document.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [Client, Message, RiskReport, GoogleSyncDocument],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    ClientsModule,
    WhatsappModule,
    GoogleModule,
    AnalysisModule,
    HealthModule,
    AlertasModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
