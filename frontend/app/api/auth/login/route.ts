import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getStore } from "@/lib/mock-db";

const SECRET = "harborflow-super-secret-key-for-jwt-signing-2026-port-ops";
const EXPIRES_IN = "24h";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { email, password } = body as { email?: string; password?: string };
  const store = getStore();
  const user = store.users.find((u: any) => u.email === email && u.password === password);
  if (!user) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  const token = jwt.sign({ sub: user.email, role: user.role }, SECRET, { algorithm: "HS256", expiresIn: EXPIRES_IN });
  return NextResponse.json({ token, email: user.email, role: user.role });
}
