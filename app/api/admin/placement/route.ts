import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { TABLES } from "@/lib/schema";

export async function POST(req: Request) {
  const session = await auth();
  if (!(session as any)?.isStaff) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const form = await req.formData();
  const discordId = String(form.get("discordId") || "");
  const result = String(form.get("result") || "");
  if (!discordId) return NextResponse.json({ error: "Missing Discord ID" }, { status: 400 });

  // Change these column names if your placements table is different.
  await query(`INSERT INTO ${TABLES.placements} (discord_id, result, created_at) VALUES ($1, $2, NOW())`, [discordId, result]);
  return NextResponse.redirect(new URL("/admin", req.url));
}
