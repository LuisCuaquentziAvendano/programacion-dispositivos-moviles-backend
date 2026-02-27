import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [PatientController],
  providers: [PatientService],
  imports: [DatabaseModule],
})
export class PatienModule {}
