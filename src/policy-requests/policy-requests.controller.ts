import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { PolicyRequestsService } from "./policy-requests.service";
import { AuthGuard } from "src/common/guards/auth.guard";
import { CreatePolicyRequestDto } from "./dto/create-policy-request.dto";
import { FiltersToRequestDto } from "./dto/filters-to-request.dto";
import { UpdatePolicyRequestDto } from "./dto/update-policy-request.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Policy Requests')
@Controller('policy-requests')
@UseGuards(AuthGuard)
export class PolicyRequestsController {
  constructor(private readonly PolicyRequestsService: PolicyRequestsService) {}
  
  @Post()
  @ApiOperation({ summary: 'Crear una nueva solicitud de póliza' })
  @ApiResponse({ status: 201, description: 'Solicitud creada con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  createdPolicyRequest(@Req() req: any, @Body() createDto: CreatePolicyRequestDto) {
    return this.PolicyRequestsService.createPolicyRequest(req, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las solicitudes de póliza' })
  @ApiResponse({ status: 200, description: 'Solicitudes obtenidas con éxito.' })
  getAllPolicyRequests(@Query() filters: FiltersToRequestDto) {
    return this.PolicyRequestsService.getAllPolicyRequests(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una solicitud de póliza por su ID' })
  @ApiResponse({ status: 200, description: 'Solicitud obtenida con éxito.' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada.' })
  @ApiParam({ name: 'id', description: 'El ID de la solicitud de póliza' })
  getPolicyRequestById(@Param('id') id: number) {
    return this.PolicyRequestsService.getPolicyRequestById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar el estado de una solicitud de póliza' })
  @ApiResponse({ status: 200, description: 'Estado de la solicitud actualizado con éxito.' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada.' })
  @ApiParam({ name: 'id', description: 'El ID de la solicitud de póliza' })
  updatePolicyRequest(@Req() req: any, @Body() updatePolicyDto: UpdatePolicyRequestDto) {
    return this.PolicyRequestsService.updatePolicyRequest(req, updatePolicyDto);
  }
}