import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { UserDbService } from './user-db.service';
import { OrganizationDbService } from './organization-db.service';
import { PatientDbService } from './patient-db.service';
import { AppointmentDbService } from './appointment-db.service';
import { ServiceDbService } from './service-db.service';

@Module({
  providers: [
    DatabaseService,
    UserDbService,
    OrganizationDbService,
    PatientDbService,
    AppointmentDbService,
    ServiceDbService,
  ],
  exports: [
    UserDbService,
    OrganizationDbService,
    PatientDbService,
    AppointmentDbService,
    ServiceDbService,
  ],
})
export class DatabaseModule {}
