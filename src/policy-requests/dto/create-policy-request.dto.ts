import { IsEmail, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePolicyRequestDto {
  @ApiProperty({
    description: 'El nombre del cliente que solicita la póliza',
    example: 'John Doe'
  })
  @IsString({ message: 'Customer name must be a string' })
  customerName!: string;

  @ApiProperty({
    description: 'El correo electrónico del cliente',
    example: 'john.doe@example.com'
  })
  @IsEmail({}, { message: 'Customer email must be a valid email address' })
  customerEmail!: string;

  @ApiProperty({
    description: 'El producto para el cual solicitar una póliza',
    example: 'Seguro de Hogar'
  })
  @IsString({ message: 'Product must be a string' })
  product!: string;

  @ApiProperty({
    description: 'El monto que desea asegurar',
    example: 100000
  })
  @IsNumber({}, { message: 'Insured amount must be a number' })
  @Min(1, { message: 'Insured amount must be greater than 0' })
  insuredAmount!: number;

  @ApiProperty({
    description: 'El estado de la solicitud de póliza',
    example: 'pending'
  })
  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  status!: string
}