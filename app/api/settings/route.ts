import { NextRequest, NextResponse } from "next/server";
import { getSetting, setSetting } from "@/lib/db";
import { reloadDnsConfig } from "@/lib/dns-init";

export async function GET() {
  const customDns = await getSetting("custom_dns") ?? "";
  return NextResponse.json({ custom_dns: customDns });
}

export async function POST(req: NextRequest) {
  try {
    const { custom_dns } = await req.json();
    await setSetting("custom_dns", custom_dns ?? "");
    await reloadDnsConfig();
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
