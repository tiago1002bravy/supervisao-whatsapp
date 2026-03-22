import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name!: string;

  @IsString()
  whatsappGroupId!: string;

  @IsOptional()
  @IsString()
  alertWhatsappNumber?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  riskThreshold?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
