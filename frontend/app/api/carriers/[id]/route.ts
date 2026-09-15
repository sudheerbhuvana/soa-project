import { NextResponse } from "next/server";
import { getStore } from "@/lib/mock-db";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const c = getStore().carriers.find((x: any) => x.carrierId === id);
  if (!c) return NextResponse.json({ message: "not found" }, { status: 404 });
  return NextResponse.json(c);
}
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json();
  const store = getStore();
  const idx = store.carriers.findIndex((x: any) => x.carrierId === id);
  if (idx < 0) return NextResponse.json({ message: "not found" }, { status: 404 });
  store.carriers[idx] = { ...store.carriers[idx], ...body, carrierId: id };
  return NextResponse.json(store.carriers[idx]);
}
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const store = getStore();
  store.carriers = store.carriers.filter((x: any) => x.carrierId !== id);
  return new NextResponse(null, { status: 204 });
}
