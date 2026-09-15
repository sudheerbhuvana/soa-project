import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getStore } from "@/lib/mock-db";
const SECRET = "harborflow-super-secret-key-for-jwt-signing-2026-port-ops";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { email, password, companyName } = body as any;
  const store = getStore();
  if (!email || !password) return NextResponse.json({ message: "Email and password required" }, { status: 400 });
  if (store.users.some((u: any) => u.email === email)) return NextResponse.json({ message: "Email already registered" }, { status: 400 });
  store.users.push({ email, password, companyName: companyName || "HarborFlow", role: "ADMIN" });
  const token = jwt.sign({ sub: email, role: "ADMIN" }, SECRET, { algorithm: "HS256", expiresIn: "24h" });
  return NextResponse.json({ token, email, role: "ADMIN" });
}
