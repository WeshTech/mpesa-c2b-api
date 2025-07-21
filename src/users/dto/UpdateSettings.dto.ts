import { IsBoolean, IsOptional } from 'class-validator';

export class updateUserSettingsDto {
  @IsBoolean()
  @IsOptional()
  notificationsOn?: boolean;

  @IsBoolean()
  @IsOptional()
  smsEnabled?: boolean;
}
