import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const reservations = await prisma.reservation.findMany({
    include: { passengers: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ok: true, data: reservations });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      from,
      to,
      date,
      time,
      phone,
      flightCode,
      passengers = [],
      luggageCount = 0,
    } = body || {};

    if (!from || !to || !date || !time || !phone) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const passengerNames: string[] = Array.isArray(passengers)
      ? passengers.filter((p) => typeof p === "string" && p.trim() !== "")
      : [];

    const created = await prisma.reservation.create({
      data: {
        from,
        to,
        date,
        time,
        phone,
        flightCode: flightCode || null,
        passengerCount: passengerNames.length || 1,
        luggageCount: Number.isFinite(Number(luggageCount)) ? Number(luggageCount) : 0,
        passengers: {
          create: passengerNames.map((name) => ({ name })),
        },
      },
      include: { passengers: true },
    });

    return NextResponse.json({ ok: true, data: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Server error" }, { status: 500 });
  }
}
