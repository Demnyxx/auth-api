import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsOptional()
  description?: string;

  /**
   * Tableau contenant les IDs des permissions à assigner au rôle
   */
  @IsOptional()
  @IsArray()
  permissions?: Array<string>;
}
