import { NextResponse } from "next/server";
import { getStore } from "@/lib/mock-db";

export async function GET() { return NextResponse.json(getStore().carriers); }
export async function POST(req: Request) {
  const body = await req.json();
  const store = getStore();
  if (store.carriers.some((c: any) => c.email === body.email)) return NextResponse.json({ message: "Email already exists" }, { status: 400 });
  const carrier = { carrierId: store.nextCarrierId = (store.nextCarrierId || 5), companyName: body.companyName, email: body.email, vesselIdentifier: body.vesselIdentifier };
  store.nextCarrierId += 1;
  store.carriers.push(carrier);
  return NextResponse.json(carrier);
}
