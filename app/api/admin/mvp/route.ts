import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { TABLES, PLAYER_COLUMNS as C } from "@/lib/schema";

export async function POST(req: Request) {
  const session = await auth();
  if (!(session as any)?.isStaff) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const form = await req.formData();
  const discordId = String(form.get("discordId") || "");
  const amount = Number(form.get("amount") || 1);
  if (!discordId) return NextResponse.json({ error: "Missing Discord ID" }, { status: 400 });
  await query(`UPDATE ${TABLES.players} SET ${C.mvps} = COALESCE(${C.mvps}, 0) + $1 WHERE ${C.discordId} = $2`, [amount, discordId]);
  return NextResponse.redirect(new URL("/admin", req.url));
}
