import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  } as Record<string, string>;
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { headers: corsHeaders(req) });
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "E-posta ve şifre zorunludur" },
        { status: 400, headers: corsHeaders(req) }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { ok: false, error: "Şifre en az 6 karakter olmalıdır" },
        { status: 400, headers: corsHeaders(req) }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { ok: false, error: "Bu e-posta adresi zaten kayıtlı" },
        { status: 409, headers: corsHeaders(req) }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "ADMIN",
      },
    });

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { ok: true, data: userWithoutPassword },
      { status: 201, headers: corsHeaders(req) }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Kayıt sırasında hata oluştu" },
      { status: 500, headers: corsHeaders(req) }
    );
  }
}