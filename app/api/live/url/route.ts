import { NextRequest, NextResponse } from "next/server";
import { requireCreds } from "@/lib/api-helpers";
import { iptv } from "@/lib/iptv";

export async function GET(req: NextRequest) {
  const r = await requireCreds();
  if (r instanceof NextResponse) return r;
  const streamId = req.nextUrl.searchParams.get("streamId") ?? "";
  // URL directe — le navigateur se connecte au serveur IPTV.
  // Les hashes anti-hotlink des segments .ts sont lies a l'IP du client,
  // donc le proxy serveur ne fonctionne pas (403).
  return NextResponse.json({ url: iptv.liveUrl(r.creds, streamId) });
}
