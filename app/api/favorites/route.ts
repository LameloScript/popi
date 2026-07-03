import { NextRequest, NextResponse } from "next/server";
import { getSessionId } from "@/lib/auth";
import { getFavorites, addFavorite, removeFavorite } from "@/lib/db";

export async function GET(req: NextRequest) {
  const sessionId = await getSessionId();
  if (!sessionId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const type = req.nextUrl.searchParams.get("type") ?? undefined;
  return NextResponse.json(await getFavorites(sessionId, type));
}

export async function POST(req: NextRequest) {
  const sessionId = await getSessionId();
  if (!sessionId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const { type, streamId, name, cover } = await req.json();
  await addFavorite(sessionId, type, streamId, name, cover);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const sessionId = await getSessionId();
  if (!sessionId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const { type, streamId } = await req.json();
  await removeFavorite(sessionId, type, streamId);
  return NextResponse.json({ ok: true });
}
