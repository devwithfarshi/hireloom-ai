import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { EmploymentType } from '@prisma/client';

export class GetJobsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(9)
  limit: number = 9;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  active?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isRemote?: boolean;
}

export class CreateJobDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Location is required' })
  location: string;

  @IsEnum(EmploymentType)
  @IsOptional()
  employmentType?: EmploymentType;

  @IsInt()
  @Min(0)
  @IsNotEmpty({ message: 'Experience is required' })
  experience: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsBoolean()
  @IsOptional()
  isRemote?: boolean;
}

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @IsOptional()
  @IsInt()
  @Min(0)
  experience?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsBoolean()
  isRemote?: boolean;
}

export class AiJobSearchDto {
  @IsString()
  @IsNotEmpty({ message: 'Query is required' })
  query: string;
}
