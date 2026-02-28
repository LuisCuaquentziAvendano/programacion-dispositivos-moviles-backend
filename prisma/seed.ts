import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { hashSync } from 'bcrypt';
import { UserRole } from '../src/utils/user-role';

const ORGANIZATIONS = 5;
const USERS = 200;
const PATIENTS = 200;
const APPOINTMENTS = 100;
type PromiseFunction = (i: number) => Promise<void>;
const PASSWORD_HASH = hashSync('SafePassword123!', 10);

config();
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function main(): Promise<void> {
  await seedOrganizations();
  await seedUsers();
  await seedPatients();
  await seedAppointments();
  console.log('Seed completed');
}

async function seedOrganizations(): Promise<void> {
  const createOrganizationAndCreator: PromiseFunction = async (i) => {
    await prisma.user.create({
      data: {
        name: `Admin User ${i}`,
        email: `admin.user${i}@test.com`,
        password: PASSWORD_HASH,
        role: UserRole.ADMIN,
        organization: { create: { name: `Organization ${i}` } },
      },
    });
  };
  await promiseBatch(ORGANIZATIONS, createOrganizationAndCreator);
}

async function seedUsers(): Promise<void> {
  const createUser: PromiseFunction = async (i) => {
    await prisma.user.create({
      data: {
        name: `User ${i}`,
        email: `user${i}@test.com`,
        password: PASSWORD_HASH,
        organizationId: randomInt(1, ORGANIZATIONS),
        role: randomFromArray([UserRole.SECRETARY, UserRole.THERAPIST]),
      },
    });
  };
  await promiseBatch(USERS, createUser);
}

async function seedPatients(): Promise<void> {
  const createPatient: PromiseFunction = async (i) => {
    await prisma.patient.create({
      data: {
        name: `Patient ${i}`,
        email: `patient${i}@test.com`,
        phoneNumber: `+52 123456789${i}`,
        organizationId: randomInt(1, ORGANIZATIONS),
      },
    });
  };
  await promiseBatch(PATIENTS, createPatient);
}

async function seedAppointments(): Promise<void> {
  const patients = await prisma.patient.findMany();
  const therapists = await prisma.user.findMany({
    where: { role: UserRole.THERAPIST },
  });
  const createAppointment: PromiseFunction = async (i) => {
    const orgaId = randomInt(1, ORGANIZATIONS);
    const patientsInOrga = patients
      .filter((p) => p.organizationId == orgaId)
      .map((p) => p.id);
    const therapistsInOrga = therapists
      .filter((t) => t.organizationId == orgaId && t.role == UserRole.THERAPIST)
      .map((t) => t.id);
    if (patientsInOrga.length == 0 || therapistsInOrga.length == 0) return;
    const [startDate, endDate] = randomDateInterval(i);
    await prisma.appointment.create({
      data: {
        patientId: randomFromArray(patientsInOrga),
        therapistId: randomFromArray(therapistsInOrga),
        organizationId: orgaId,
        startDate,
        endDate,
      },
    });
  };
  await promiseBatch(APPOINTMENTS, createAppointment);
}

async function promiseBatch(
  n: number,
  callback: PromiseFunction,
): Promise<void> {
  await Promise.all(range(n).map(async (i) => callback(i)));
}

function range(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFromArray<T>(array: T[]): T {
  const index = randomInt(0, array.length - 1);
  return array[index];
}

function randomDateInterval(i: number): [Date, Date] {
  const now = new Date().getTime();
  const MS_BEFORE = (3 * APPOINTMENTS - 2 * i) * (60 * 60 * 1000);
  const startDate = randomInt(now - MS_BEFORE, now);
  const endDate = startDate + randomFromArray([15, 30, 45, 60]) * 60 * 1000;
  return [new Date(startDate), new Date(endDate)];
}
