import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Get all vehicles
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const vehicles = await prisma.vehicle.findMany({
      include: {
        drivers: {
          select: {
            id: true,
            name: true,
            phone: true,
            isExternal: true,
          },
        },
        _count: {
          select: {
            drivers: true,
          },
        },
      },
      orderBy: {
        plate: 'asc',
      },
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}

// Create a new vehicle
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { plate, brand, model, year, capacity, type } = data;

    // Validate required fields
    if (!plate || !brand || !model) {
      return NextResponse.json(
        { error: 'Plate, brand, and model are required' },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        plate,
        brand,
        model,
        year: year || new Date().getFullYear(),
        capacity: capacity || 4,
        type: type || 'STANDARD',
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 });
  }
}