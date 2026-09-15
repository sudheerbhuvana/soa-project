import { NextResponse } from "next/server";
import { getStore } from "@/lib/mock-db";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const c = getStore().containers.find((x: any) => x.containerId === id);
  if (!c) return NextResponse.json({ message: "not found" }, { status: 404 });
  return NextResponse.json(c);
}
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json();
  const store = getStore();
  const idx = store.containers.findIndex((x: any) => x.containerId === id);
  if (idx < 0) return NextResponse.json({ message: "not found" }, { status: 404 });
  store.containers[idx] = { ...store.containers[idx], carrierId: Number(body.carrierId), weight: Number(body.weight), cargoType: body.cargoType, currentStatus: body.currentStatus };
  return NextResponse.json(store.containers[idx]);
}
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const store = getStore();
  store.containers = store.containers.filter((x: any) => x.containerId !== id);
  return new NextResponse(null, { status: 204 });
}
