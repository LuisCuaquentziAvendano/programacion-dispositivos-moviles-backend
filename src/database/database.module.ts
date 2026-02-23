import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { UserDbService } from './user.service';

@Module({
  providers: [DatabaseService, UserDbService],
  exports: [UserDbService],
})
export class DatabaseModule {}
