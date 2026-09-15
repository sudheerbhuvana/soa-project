import { NextResponse } from "next/server";
import { getStore } from "@/lib/mock-db";
export async function GET(_req: Request, { params }: { params: { carrierId: string } }) {
  return NextResponse.json(getStore().containers.filter((c: any) => c.carrierId === Number(params.carrierId)));
}
