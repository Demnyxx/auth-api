import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsOptional()
  description?: string;
}
