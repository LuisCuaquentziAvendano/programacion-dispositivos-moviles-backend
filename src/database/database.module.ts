import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { UserDbService } from './user-db.service';
import { OrganizationDbService } from './organization-db.service';

@Module({
  providers: [DatabaseService, UserDbService, OrganizationDbService],
  exports: [UserDbService, OrganizationDbService],
})
export class DatabaseModule {}
