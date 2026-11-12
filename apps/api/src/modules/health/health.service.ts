import { Injectable } from '@nestjs/common';
import { type HealthResponse, healthResponse } from '@kavach/shared';

@Injectable()
export class HealthService {
  check(): HealthResponse {
    return healthResponse('api');
  }
}
