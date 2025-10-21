import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default admin user
  const hashedPassword = await bcrypt.hash('teraturizm123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'teraturizm' },
    update: {},
    create: {
      email: 'teraturizm',
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create accountant user
  const accountant = await prisma.user.upsert({
    where: { email: 'muhasebe' },
    update: {},
    create: {
      email: 'muhasebe',
      passwordHash: hashedPassword,
      role: 'ACCOUNTANT',
    },
  });

  // Create sample vehicles
  const vehicle1 = await prisma.vehicle.create({
    data: {
      plate: '34ABC123',
      brand: 'Mercedes',
      model: 'Vito',
      year: 2022,
      capacity: 7,
      type: 'VIP',
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      plate: '34XYZ789',
      brand: 'Mercedes',
      model: 'Sprinter',
      year: 2021,
      capacity: 12,
      type: 'MINIBUS',
    },
  });

  // Create sample drivers (company drivers)
  const driver1 = await prisma.driver.create({
    data: {
      name: 'Ahmet Yılmaz',
      phone: '05321234567',
      email: 'ahmet@example.com',
      licenseNo: 'A123456',
      isExternal: false,
      vehicleId: vehicle1.id,
    },
  });

  const driver2 = await prisma.driver.create({
    data: {
      name: 'Mehmet Kaya',
      phone: '05337654321',
      email: 'mehmet@example.com',
      licenseNo: 'B654321',
      isExternal: false,
      vehicleId: vehicle2.id,
    },
  });

  // Create external driver
  const externalDriver = await prisma.driver.create({
    data: {
      name: 'Ali Demir',
      phone: '05349876543',
      isExternal: true,
    },
  });

  console.log('Created admin user:', admin);
  console.log('Created accountant user:', accountant);
  console.log('Created vehicles:', [vehicle1, vehicle2]);
  console.log('Created drivers:', [driver1, driver2, externalDriver]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });