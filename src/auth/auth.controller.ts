import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signUp(signupDto)
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Delete('deactivate/:id')
  @ApiOperation({ summary: 'Desactivar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario desactivado con éxito.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiParam({ name: 'id', description: 'El ID del usuario' })
  deleteUser(@Param('id') id: number) {
    return this.authService.deactivateUser(id);
  }
}