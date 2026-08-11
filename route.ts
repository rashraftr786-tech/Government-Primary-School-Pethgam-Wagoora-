import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, service: "ps-pethgam-erp", timestamp: new Date().toISOString() });
}
