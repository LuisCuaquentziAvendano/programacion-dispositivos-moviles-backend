import { PartialType } from '@nestjs/mapped-types';

import { CreatePatientDto } from './create-patient.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdatePatientDto extends PartialType(CreatePatientDto) {}
