import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilters } from './filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
    prefix: "v"
  })

  app.useGlobalFilters(new AllExceptionsFilters())

  app.enableCors({
    origin: process.env.CORS,
    credentials:true
  })

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform:true
  }))

  app.setGlobalPrefix("/api")


  const config = new DocumentBuilder()
    .setTitle('EXAM month 4')
    .setDescription('EXAM month 4 in Najot Talim mf')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);


  const port = process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000
  await app.listen(port, () => {
    console.log(`http://localhost:${port}/doc`);
  });
}
bootstrap();
