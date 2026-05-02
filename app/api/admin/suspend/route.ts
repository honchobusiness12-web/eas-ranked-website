import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { TABLES, PLAYER_COLUMNS as C } from "@/lib/schema";

export async function POST(req: Request) {
  const session = await auth();
  if (!(session as any)?.isStaff) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const form = await req.formData();
  const discordId = String(form.get("discordId") || "");
  const action = String(form.get("action") || "");

  const updates: Record<string, string> = {
    suspend: `${C.suspended} = true`,
    unsuspend: `${C.suspended} = false`,
    blacklist: `${C.blacklisted} = true`,
    unblacklist: `${C.blacklisted} = false`,
  };
  if (!discordId || !updates[action]) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  await query(`UPDATE ${TABLES.players} SET ${updates[action]} WHERE ${C.discordId} = $1`, [discordId]);
  return NextResponse.redirect(new URL("/admin", req.url));
}
