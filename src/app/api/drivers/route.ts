import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Get all drivers
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const drivers = await prisma.driver.findMany({
      include: {
        vehicle: true,
        reservations: {
          select: {
            id: true,
            date: true,
            time: true,
            from: true,
            to: true,
            status: true,
          },
          orderBy: {
            date: 'asc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(drivers);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json({ error: 'Failed to fetch drivers' }, { status: 500 });
  }
}

// Create a new driver
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { name, phone, email, licenseNo, isExternal, vehicleId } = data;

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    const driver = await prisma.driver.create({
      data: {
        name,
        phone,
        email,
        licenseNo,
        isExternal: isExternal || false,
        vehicleId: isExternal ? null : vehicleId,
      },
      include: {
        vehicle: true,
      },
    });

    return NextResponse.json(driver, { status: 201 });
  } catch (error) {
    console.error('Error creating driver:', error);
    return NextResponse.json({ error: 'Failed to create driver' }, { status: 500 });
  }
}