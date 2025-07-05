import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
export class GetCompaniesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(10)
  limit: number = 10;
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
  industry?: string;
}

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Company name is required' })
  @IsString()
  name: string;
  
  @IsNotEmpty({ message: 'Company industry is required' })
  @IsString()
  industry: string;
  
  @IsNotEmpty({ message: 'Company location is required' })
  @IsString()
  location: string;
  
  @IsOptional()
  @IsString()
  companySize?: string;
  
  @IsOptional()
  @IsString()
  domain?: string;
}

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  name?: string;
  
  @IsOptional()
  @IsString()
  industry?: string;
  
  @IsOptional()
  @IsString()
  location?: string;
  
  @IsOptional()
  @IsString()
  companySize?: string;
  
  @IsOptional()
  @IsString()
  domain?: string;
}
