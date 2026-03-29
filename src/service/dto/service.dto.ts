import { Service } from '@prisma/client';

export class ServiceDto {
  id: number;
  name: string;
  duration: number;
}

export function formatService(service: Service): ServiceDto {
  return {
    id: service.id,
    name: service.name,
    duration: service.duration,
  };
}
