import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  /**
   * ID du rôle à attribuer à l'utilisateur
   */
  @IsUUID()
  roleId: string;
}
