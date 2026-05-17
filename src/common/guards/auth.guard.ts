import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if(!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token);
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers['authorization'];
    if(!authHeader) {
      return null;
    }
    if(!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }

    const [type, token] = authHeader.split(' ');
    if(type === 'Bearer' && token) {
      return token;
    }
    throw new UnauthorizedException('Invalid token format');
  }
}