import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApplicationStatus } from '@prisma/client';

export class CreateApplicationDto {
  @IsUUID()
  @IsNotEmpty({ message: 'Job ID is required' })
  jobId: string;
}

export class UpdateApplicationDto {
  @IsEnum(ApplicationStatus, { message: 'Invalid application status' })
  @IsOptional()
  status?: ApplicationStatus;

  @IsInt({ message: 'Score must be an integer' })
  @Min(0, { message: 'Score must be a positive number' })
  @IsOptional()
  score?: number;

  @IsString({ message: 'Notes must be a string' })
  @IsOptional()
  notes?: string;
}

export class GetApplicationsDto {
  @IsOptional()
  @IsEnum(ApplicationStatus, { message: 'Invalid application status' })
  status?: ApplicationStatus;

  @IsOptional()
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt({ message: 'Limit must be an integer' })
  @Min(9, { message: 'Limit must be at least 1' })
  @Type(() => Number)
  limit?: number;
}
