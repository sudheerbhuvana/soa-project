import { NextResponse } from "next/server";
import { getStore } from "@/lib/mock-db";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const store = getStore();
  store.tx = store.tx.filter((x: any) => x.gateTransactionId !== id);
  return new NextResponse(null, { status: 204 });
}
