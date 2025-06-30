import { IsOptional, IsString } from 'class-validator';
export class UpdateDto {
  @IsString()
  @IsOptional()
  firstName: string;
  @IsOptional()
  @IsString()
  lastName: string;
}
