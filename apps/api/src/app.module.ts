import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuditLogsController, AuditLogsService } from './modules/audit-logs/audit-logs';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { CategoriesController, CategoriesService } from './modules/categories/categories';
import { DashboardController, DashboardService } from './modules/dashboard/dashboard';
import { HealthModule } from './modules/health/health.module';
import { LocationsController, LocationsService } from './modules/locations/locations';
import { MaterialsController } from './modules/materials/materials.controller';
import { MaterialsService } from './modules/materials/materials.service';
import { ProjectsController, ProjectsService } from './modules/projects/projects';
import { StoresController, StoresService } from './modules/stores/stores';
import { UnitsController, UnitsService } from './modules/units/units';
import { UsersController, UsersService } from './modules/users/users';

@Module({
  imports: [PrismaModule, CommonModule, HealthModule],
  controllers: [
    AuthController,
    ProjectsController,
    StoresController,
    LocationsController,
    CategoriesController,
    UnitsController,
    MaterialsController,
    UsersController,
    AuditLogsController,
    DashboardController,
  ],
  providers: [
    AuthService,
    ProjectsService,
    StoresService,
    LocationsService,
    CategoriesService,
    UnitsService,
    MaterialsService,
    UsersService,
    AuditLogsService,
    DashboardService,
  ],
})
export class AppModule {}
