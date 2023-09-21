import { Controller, Get } from '@nestjs/common';
import { MembershipService } from './membership.service';

@Controller()
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get()
  getHello(): string {
    return this.membershipService.getHello();
  }
}
