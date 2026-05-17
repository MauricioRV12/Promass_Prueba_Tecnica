import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }))

  const config = new DocumentBuilder()
    .setTitle('Policy Requests API')
    .setDescription('Documentación de la API para la gestión de solicitudes de pólizas')
    .setVersion('1.0')
    .addTag('policy-requests')
    .addBearerAuth()
    .build();
  
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs-policy-requests', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
