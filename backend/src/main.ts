import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configSwagger } from './config/swagger.config';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './app/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); // 여기서 가져오기

  app.enableCors({
          origin: configService.get<string>('CORS_ORIGIN'),
  });

  configSwagger(app);
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(configService.get<number>('PORT') ?? 3000);
}
bootstrap();
