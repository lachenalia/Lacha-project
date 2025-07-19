import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configSwagger(app: INestApplication) {
  const documentConf = new DocumentBuilder()
    .setTitle('Lacha Project')
    .setDescription("Lachenalia's First Project")
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
