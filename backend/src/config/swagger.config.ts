import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configSwagger(app: INestApplication) {
  const documentConf = new DocumentBuilder()
    .setTitle('Pichu Project')
    .setDescription('피츄는 172번이다.')
    .setVersion('0.9')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentConf);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  });
}
