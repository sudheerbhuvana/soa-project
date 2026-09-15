import { NextResponse } from "next/server";
import { getStore } from "@/lib/mock-db";
export async function GET() { return NextResponse.json(getStore().slots); }
export async function POST(req: Request) {
  const body = await req.json();
  const store = getStore();
  const s = { slotId: (store.nextSlotId = store.nextSlotId || 19), zoneCode: body.zoneCode, rowNumber: Number(body.rowNumber), isOccupied: !!body.isOccupied, containerId: body.containerId ?? null };
  store.nextSlotId += 1;
  store.slots.push(s);
  return NextResponse.json(s);
}
