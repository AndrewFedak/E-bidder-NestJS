import { NestFactory } from '@nestjs/core';
import { ListingsModule } from './listings.module';

async function bootstrap() {
  const app = await NestFactory.create(ListingsModule);
  await app.listen(3000);
}
bootstrap();
