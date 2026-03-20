import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  );

  const port = Number(process.env.PORT || 3001);
  await app.listen(port);
  console.log(`Backend listening on http://localhost:${port}`);
}

bootstrap();
