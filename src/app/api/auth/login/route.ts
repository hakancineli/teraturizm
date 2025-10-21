import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Geçersiz e-posta veya şifre" },
        { status: 401, headers: corsHeaders(req) }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { ok: false, error: "Geçersiz e-posta veya şifre" },
        { status: 401, headers: corsHeaders(req) }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || "fallback-secret-key",
      { expiresIn: "7d" }
    );

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        ok: true, 
        data: {
          user: userWithoutPassword,
          token
        }
      },
      { status: 200, headers: corsHeaders(req) }
    );
  } catch (error: unknown) {
    console.error("Login error:", error);
    const errorMessage = error instanceof Error ? error.message : "Giriş sırasında hata oluştu";
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500, headers: corsHeaders(req) }
    );
  }
}