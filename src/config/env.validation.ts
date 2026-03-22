import { plainToInstance } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min, validateSync } from 'class-validator';

enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsString()
  DATABASE_URL!: string;

  @IsString()
  UAZAPI_BASE_URL!: string;

  @IsString()
  UAZAPI_TOKEN!: string;

  @IsString()
  UAZAPI_WEBHOOK_SECRET!: string;

  @IsString()
  OPENAI_API_KEY!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number = 3000;

  @IsOptional()
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv = NodeEnv.Development;

  @IsOptional()
  @IsString()
  GOOGLE_SERVICE_ACCOUNT_KEY?: string;

  @IsOptional()
  @IsString()
  GOOGLE_IMPERSONATE_EMAIL?: string;

  @IsOptional()
  @IsString()
  GOOGLE_TEAM_ROOT_FOLDER_ID?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
