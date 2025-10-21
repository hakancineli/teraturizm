import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export const runtime = "nodejs";

const ALLOWED_ORIGINS = new Set([
  "http://localhost:3001",
  "http://127.0.0.1:3001",
]);

function corsHeaders(req: NextRequest) {
  const origin = req.headers.get("origin") || "*";
  const allowOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  } as Record<string, string>;
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { headers: corsHeaders(req) });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Yetkilendirme gerekli" },
        { status: 401, headers: corsHeaders(req) }
      );
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Geçersiz token" },
        { status: 401, headers: corsHeaders(req) }
      );
    }

    const { status, driverId, isExternal, externalDriverName, externalDriverPhone, price, paymentStatus } = await req.json();
    const { id } = await params;
    const reservationId = parseInt(id);

    if (!reservationId || isNaN(reservationId)) {
      return NextResponse.json(
        { ok: false, error: "Geçersiz rezervasyon ID" },
        { status: 400, headers: corsHeaders(req) }
      );
    }

    if (status && !["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].includes(status)) {
      return NextResponse.json(
        { ok: false, error: "Geçersiz durum" },
        { status: 400, headers: corsHeaders(req) }
      );
    }

    if (paymentStatus && !["UNPAID", "PAID", "PARTIALLY_PAID", "REFUNDED"].includes(paymentStatus)) {
      return NextResponse.json(
        { ok: false, error: "Geçersiz ödeme durumu" },
        { status: 400, headers: corsHeaders(req) }
      );
    }

    // Build update data
    const updateData: any = {};
    
    if (status) updateData.status = status;
    if (price !== undefined) updateData.price = price;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    
    // Handle driver assignment
    if (driverId !== undefined) {
      updateData.driverId = driverId;
      updateData.isExternal = isExternal || false;
      
      if (isExternal) {
        updateData.externalDriverName = externalDriverName;
        updateData.externalDriverPhone = externalDriverPhone;
      } else {
        // Clear external driver fields if assigning company driver
        updateData.externalDriverName = null;
        updateData.externalDriverPhone = null;
      }
    }

    // Update reservation
    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: updateData,
      include: { 
        passengers: true,
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            isExternal: true,
            vehicle: {
              select: {
                plate: true,
                brand: true,
                model: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { ok: true, data: updatedReservation },
      { headers: corsHeaders(req) }
    );
  } catch (error: unknown) {
    console.error("Error updating reservation:", error);
    const errorMessage = error instanceof Error ? error.message : "Sunucu hatası";
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500, headers: corsHeaders(req) }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Yetkilendirme gerekli" },
        { status: 401, headers: corsHeaders(req) }
      );
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Geçersiz token" },
        { status: 401, headers: corsHeaders(req) }
      );
    }

    const { id } = await params;
    const reservationId = parseInt(id);

    if (!reservationId || isNaN(reservationId)) {
      return NextResponse.json(
        { ok: false, error: "Geçersiz rezervasyon ID" },
        { status: 400, headers: corsHeaders(req) }
      );
    }

    // Delete reservation (will also delete related passengers due to cascade)
    await prisma.reservation.delete({
      where: { id: reservationId },
    });

    return NextResponse.json(
      { ok: true, message: "Rezervasyon silindi" },
      { headers: corsHeaders(req) }
    );
  } catch (error: unknown) {
    console.error("Error deleting reservation:", error);
    const errorMessage = error instanceof Error ? error.message : "Sunucu hatası";
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500, headers: corsHeaders(req) }
    );
  }
}