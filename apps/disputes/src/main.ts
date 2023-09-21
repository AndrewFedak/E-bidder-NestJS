import { NestFactory } from '@nestjs/core';
import { DisputesModule } from './disputes.module';

async function bootstrap() {
  const app = await NestFactory.create(DisputesModule);
  await app.listen(3000);
}
bootstrap();
