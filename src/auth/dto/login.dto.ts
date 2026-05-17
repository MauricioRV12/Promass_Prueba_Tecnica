import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    description: 'El nombre de usuario para iniciar sesión',
    example: 'john_doe'
  })
  @IsString({ message: 'Username must be a string' })
  username!: string;

  @ApiProperty({
    description: 'La contraseña para iniciar sesión',
    example: 'secret123'
  })
  @IsString({ message: 'Password must be a string' })
  password!: string;
}