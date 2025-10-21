import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";

export interface User {
  id: number;
  email: string;
  role: "ADMIN" | "ACCOUNTANT";
}

export interface AuthUser extends User {
  token: string;
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key") as User;
    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
}

export async function auth(req: NextRequest): Promise<User | null> {
  const token = getTokenFromRequest(req);
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
}