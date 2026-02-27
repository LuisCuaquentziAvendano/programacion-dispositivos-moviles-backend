import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService],
  imports: [DatabaseModule],
})
export class OrganizationModule {}
