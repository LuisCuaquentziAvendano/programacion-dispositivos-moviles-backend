import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { UserDbService } from './user-db.service';
import { OrganizationDbService } from './organization-db.service';
import { PatientDbService } from './patient-db.service';

@Module({
  providers: [
    DatabaseService,
    UserDbService,
    OrganizationDbService,
    PatientDbService,
  ],
  exports: [UserDbService, OrganizationDbService, PatientDbService],
})
export class DatabaseModule {}
