import { NextResponse } from "next/server";
import { getStore } from "@/lib/mock-db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const { status } = await req.json();
  const store = getStore();
  const idx = store.containers.findIndex((x: any) => x.containerId === id);
  if (idx < 0) return NextResponse.json({ message: "not found" }, { status: 404 });
  store.containers[idx].currentStatus = status;
  return NextResponse.json(store.containers[idx]);
}
