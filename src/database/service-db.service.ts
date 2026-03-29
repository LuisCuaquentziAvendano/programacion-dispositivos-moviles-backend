import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Prisma, Service } from '@prisma/client';

@Injectable()
export class ServiceDbService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(serviceData: Prisma.ServiceCreateInput): Promise<Service> {
    const service = await this.databaseService.service.create({
      data: serviceData,
    });
    return service;
  }

  async getById(
    serviceId: number,
    organizationId: number,
  ): Promise<Service | null> {
    const service = await this.databaseService.service.findUnique({
      where: { id: serviceId, organizationId },
    });
    return service;
  }

  async getByIdOrThrow(
    serviceId: number,
    organizationId: number,
  ): Promise<Service> {
    const service = await this.getById(serviceId, organizationId);
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async getAll(organizationId: number): Promise<Service[]> {
    const services = await this.databaseService.service.findMany({
      where: { organizationId },
    });
    return services;
  }
}
