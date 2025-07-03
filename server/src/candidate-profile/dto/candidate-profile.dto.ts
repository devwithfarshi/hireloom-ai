import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateCandidateProfileDto {
  @IsString()
  @IsNotEmpty({ message: 'Location is required' })
  location: string;

  @IsBoolean()
  @IsOptional()
  openToRemote?: boolean;

  @IsString()
  @IsNotEmpty({ message: 'Resume URL is required' })
  resumeUrl: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ message: 'Skills are required' })
  skills: string[];

  @IsInt()
  @Min(0, { message: 'Experience must be a positive number' })
  @IsNotEmpty({ message: 'Experience is required' })
  experience: number;
}

export class UpdateCandidateProfileDto {
  @IsString()
  @IsOptional()
  location?: string;

  @IsBoolean()
  @IsOptional()
  openToRemote?: boolean;

  @IsString()
  @IsOptional()
  resumeUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @IsInt()
  @Min(0, { message: 'Experience must be a positive number' })
  @IsOptional()
  experience?: number;
}