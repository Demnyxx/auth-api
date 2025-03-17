import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsOptional()
  description?: string;
}
