import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { createSessionValue, sessionCookie, clearCookie, requireAdmin } from "@/lib/admin-auth";

// Issues the httpOnly session cookie the Message Center API requires.
// The rest of the portal keeps its existing localStorage flag; this adds a
// server-verifiable session for the endpoints that can spend money.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json().catch(() => ({}));
  if (!username || !password) {
    return NextResponse.json({ ok: false, error: "Username and password required" }, { status: 400 });
  }

  let name = "";
  let role = "";

  // 1) Staff accounts. Passwords are stored as a SHA-256 hash; the plaintext
  //    comparison is a fallback for any legacy row that predates hashing.
  try {
    const supabase = getServiceSupabase();
    const crypto = await import("crypto");
    const hash = crypto.createHash("sha256").update(password).digest("hex");
    const { data } = await supabase
      .from("admin_users")
      .select("name, role, email, password_hash, status")
      .ilike("email", String(username).trim())
      .limit(1);
    const user = data?.[0];
    if (user && user.status !== "disabled" && user.password_hash) {
      if (user.password_hash === hash || user.password_hash === password) {
        name = user.name || user.email;
        role = user.role;
        await supabase.from("admin_users")
          .update({ last_login: new Date().toISOString() })
          .ilike("email", String(username).trim());
      }
    }
  } catch { /* fall through to the shared credential */ }

  // 2) Shared staff credential. Set ADMIN_PASSWORD in Vercel to replace the
  //    legacy demo password; the fallback keeps existing staff working.
  if (!role) {
    const sharedPassword = process.env.ADMIN_PASSWORD || "ttrg";
    const sharedUser = process.env.ADMIN_USERNAME || "ttrg";
    if (username === sharedUser && password === sharedPassword) {
      name = "TTRG Admin"; role = "super_admin";
    }
  }

  if (!role) {
    return NextResponse.json({ ok: false, error: "Invalid username or password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, name, role });
  res.headers.set("Set-Cookie", sessionCookie(createSessionValue(name, role)));
  return res;
}

/** Who am I? Used by the Message Center to check it can call the send API. */
export async function GET(req: NextRequest) {
  const session = requireAdmin(req);
  return NextResponse.json({ ok: !!session, session });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", clearCookie());
  return res;
}
