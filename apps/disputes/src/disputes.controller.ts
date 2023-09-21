import { Controller, Get } from '@nestjs/common';
import { DisputesService } from './disputes.service';

@Controller()
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Get()
  getHello(): string {
    return this.disputesService.getHello();
  }
}
