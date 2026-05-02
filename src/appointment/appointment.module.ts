import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { DatabaseModule } from 'src/database/database.module';
import { GoogleCalendarService } from './google-calendar.service';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService, GoogleCalendarService],
  imports: [DatabaseModule],
})
export class AppointmentModule {}
