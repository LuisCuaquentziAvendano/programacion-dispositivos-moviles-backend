import { Injectable } from '@nestjs/common';
import { ServiceDbService } from 'src/database/service-db.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { formatService, ServiceDto } from './dto/service.dto';

@Injectable()
export class ServiceService {
  constructor(private readonly serviceDbService: ServiceDbService) {}

  async create(
    serviceData: CreateServiceDto,
    organizationId: number,
  ): Promise<ServiceDto> {
    const service = await this.serviceDbService.create({
      ...serviceData,
      organization: { connect: { id: organizationId } },
    });
    return formatService(service);
  }

  async getAll(organizationId: number): Promise<ServiceDto[]> {
    const services = await this.serviceDbService.getAll(organizationId);
    return services.map((service) => formatService(service));
  }
}
