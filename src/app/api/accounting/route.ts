import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Get all accounting records with filtering
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type'); // INCOME or EXPENSE

    // Build filter
    const filter: any = {};
    
    if (startDate || endDate) {
      filter.paymentDate = {};
      if (startDate) filter.paymentDate.gte = new Date(startDate);
      if (endDate) filter.paymentDate.lte = new Date(endDate);
    }
    
    if (type) {
      filter.type = type as 'INCOME' | 'EXPENSE';
    }

    const records = await prisma.accountingRecord.findMany({
      where: filter,
      include: {
        reservation: {
          select: {
            id: true,
            from: true,
            to: true,
            date: true,
            time: true,
            phone: true,
            status: true,
            driver: {
              select: {
                id: true,
                name: true,
                phone: true,
                isExternal: true,
              },
            },
          },
        },
      },
      orderBy: {
        paymentDate: 'desc',
      },
    });

    // Calculate totals
    const totalIncome = records
      .filter(r => r.type === 'INCOME')
      .reduce((sum, r) => sum + r.amount, 0);
      
    const totalExpense = records
      .filter(r => r.type === 'EXPENSE')
      .reduce((sum, r) => sum + r.amount, 0);
      
    const netIncome = totalIncome - totalExpense;

    return NextResponse.json({
      records,
      totals: {
        income: totalIncome,
        expense: totalExpense,
        net: netIncome,
      },
    });
  } catch (error) {
    console.error('Error fetching accounting records:', error);
    return NextResponse.json({ error: 'Failed to fetch accounting records' }, { status: 500 });
  }
}

// Create a new accounting record
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { 
      reservationId, 
      amount, 
      description, 
      type, 
      paymentMethod, 
      paymentDate 
    } = data;

    // Validate required fields
    if (!amount || !type) {
      return NextResponse.json(
        { error: 'Amount and type are required' },
        { status: 400 }
      );
    }

    const record = await prisma.accountingRecord.create({
      data: {
        reservationId,
        amount,
        description,
        type: type as 'INCOME' | 'EXPENSE',
        paymentMethod,
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      },
      include: {
        reservation: {
          select: {
            id: true,
            from: true,
            to: true,
            date: true,
            time: true,
            phone: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('Error creating accounting record:', error);
    return NextResponse.json({ error: 'Failed to create accounting record' }, { status: 500 });
  }
}