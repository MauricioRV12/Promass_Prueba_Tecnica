import { IsString, IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignupDto {
  @ApiProperty({
    description: 'El nombre del usuario',
    example: 'John'
  })
  @IsString({ message: 'Name must be a string' })
  name!: string;

  @ApiProperty({
    description: 'El apellido del usuario',
    example: 'Doe'
  })
  @IsString({ message: 'Last name must be a string' })
  lastName!: string;

  @ApiProperty({
    description: 'El nombre de usuario',
    example: 'john_doe'
  })
  @IsString({ message: 'Username must be a string' })
  username!: string;

  @ApiProperty({
    description: 'El correo electrónico del usuario',
    example: 'john.doe@example.com'
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  @ApiProperty({
    description: 'La contraseña del usuario',
    example: 'secret123'
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  password!: string;

  @ApiProperty({
    description: 'El rol del usuario',
    example: 'admin'
  })
  @IsOptional()
  @IsString({ message: 'Role must be a string' })
  role!: string
}