import { NextResponse } from "next/server";
import { getStore } from "@/lib/mock-db";

export async function GET() { return NextResponse.json(getStore().tx); }
export async function POST(req: Request) {
  const body = await req.json();
  const store = getStore();
  const t = { gateTransactionId: (store.nextTxId = store.nextTxId || 5), containerId: Number(body.containerId), transactionType: body.transactionType, truckLicense: body.truckLicense, timestamp: new Date().toISOString() };
  store.nextTxId += 1;
  store.tx.push(t);
  return NextResponse.json(t);
}
