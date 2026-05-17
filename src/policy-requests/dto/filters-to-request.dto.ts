import { IsString, IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class FiltersToRequestDto {
  @ApiProperty({
    description: 'El estado de la solicitud de póliza',
    example: 'pending'
  })
  @IsString()
  status?: string;
  
  @ApiProperty({
    description: 'El nombre del cliente',
    example: 'John Doe'
  })
  @IsOptional()
  @IsString()
  customerName?: string;
  
  @ApiProperty({
    description: 'El folio de la solicitud',
    example: 'POL-001'
  })
  @IsOptional()
  @IsString()
  folio?: string;

  @ApiProperty({
    description: 'El número de solicitudes',
    example: 10
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Number of requests must be a number' })
  numRequests!: number;
}