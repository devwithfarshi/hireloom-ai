import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SocialLink {
  @IsString()
  @IsNotEmpty({ message: 'Platform name is required' })
  platform: string;

  @IsString()
  @IsUrl({}, { message: 'Please provide a valid URL' })
  @IsNotEmpty({ message: 'URL is required' })
  url: string;
}

export class CreateCandidateProfileDto {
  @IsString()
  @IsNotEmpty({ message: 'Location is required' })
  location: string;

  @IsBoolean()
  @IsOptional()
  openToRemote?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ message: 'Skills are required' })
  skills: string[];

  @IsInt()
  @Min(0, { message: 'Experience must be a positive number' })
  @IsNotEmpty({ message: 'Experience is required' })
  experience: number;
  
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLink)
  socialLinks?: SocialLink[];
}

export class UpdateCandidateProfileDto {
  @IsString()
  @IsOptional()
  location?: string;

  @IsBoolean()
  @IsOptional()
  openToRemote?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @IsInt()
  @Min(0, { message: 'Experience must be a positive number' })
  @IsOptional()
  experience?: number;
  
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLink)
  socialLinks?: SocialLink[];
}