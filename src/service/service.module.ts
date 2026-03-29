import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService],
  imports: [DatabaseModule],
})
export class ServiceModule {}
