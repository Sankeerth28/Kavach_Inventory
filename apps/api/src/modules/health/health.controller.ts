import { Controller, Get } from '@nestjs/common';
import type { HealthResponse } from '@kavach/shared';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  check(): HealthResponse {
    return this.health.check();
  }
}
