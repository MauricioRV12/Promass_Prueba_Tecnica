import { ConfigService } from '@nestjs/config';

export const databaseConfig = (config: ConfigService) => ({
  type: 'mssql' as const,
  host: config.get<string>('DB_HOST'),
  port: config.get<string>('DB_PORT') ? parseInt(config.get<string>('DB_PORT')!) : 1433,
  username: config.get<string>('DB_USER'),
  password: config.get<string>('DB_PASSWORD'),
  database: config.get<string>('DB_NAME'),

  entities: [__dirname + '/../**/*.entity{.ts,.js}'],

  synchronize: true,

  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});