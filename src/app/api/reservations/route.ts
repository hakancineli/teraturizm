import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

function corsHeaders(req: NextRequest) {
  const origin = req.headers.get("origin") || "*";
  const allowOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  } as Record<string, string>;
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { headers: corsHeaders(req) });
}

export async function GET(req: NextRequest) {
  const reservations = await prisma.reservation.findMany({
    include: { passengers: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ok: true, data: reservations }, { headers: corsHeaders(req) });
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

    return NextResponse.json({ ok: true, data: created }, { status: 201, headers: corsHeaders(req) });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Server error" }, { status: 500, headers: corsHeaders(req) });
  }
}
