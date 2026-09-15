import { NextResponse } from "next/server";
import { getStore } from "@/lib/mock-db";
export async function GET(_req: Request, { params }: { params: { containerId: string } }) {
  return NextResponse.json(getStore().tx.filter((t: any) => t.containerId === Number(params.containerId)));
}
