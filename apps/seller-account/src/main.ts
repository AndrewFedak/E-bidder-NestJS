import { NestFactory } from '@nestjs/core';
import { SellerAccountModule } from './seller-account.module';

async function bootstrap() {
  const app = await NestFactory.create(SellerAccountModule);
  await app.listen(3000);
}
bootstrap();
