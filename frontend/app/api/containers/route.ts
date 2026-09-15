import { NextResponse } from "next/server";
import { getStore } from "@/lib/mock-db";

export async function GET() { return NextResponse.json(getStore().containers); }
export async function POST(req: Request) {
  const body = await req.json();
  const store = getStore();
  const c = { containerId: (store.nextContainerId = store.nextContainerId || 6), carrierId: Number(body.carrierId), weight: Number(body.weight), cargoType: body.cargoType, currentStatus: body.currentStatus || "REGISTERED" };
  store.nextContainerId += 1;
  store.containers.push(c);
  return NextResponse.json(c);
}
