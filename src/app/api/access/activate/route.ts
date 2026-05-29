import { NextRequest, NextResponse } from "next/server";
import { createSession, consumeInviteCode, validateAdminUser } from "@/lib/access/session";
import { getCapabilities, ROLE_INVITE, ROLE_ADMIN } from "@/lib/access/roles";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const mode = (body.mode ?? "").trim();

  if (mode === "invite") {
    const code = (body.inviteCode ?? "").trim();
    const consumed = consumeInviteCode(code);
    if (!consumed) {
      return NextResponse.json({ error: "Invite code is invalid or no longer active" }, { status: 403 });
    }
    const session = createSession({
      role: ROLE_INVITE,
      accessType: "invite_code",
      userId: `invite:${consumed.code}:${consumed.usedCount}`,
    });
    return NextResponse.json({
      accessToken: session.token,
      role: session.role,
      accessType: session.accessType,
      activated: true,
      capabilities: getCapabilities(session.role),
      expiresAt: session.expiresAt,
    });
  }

  if (mode === "admin") {
    const adminCode = (body.adminCode ?? "").trim();
    const birthDate = (body.birthDate ?? "").trim();
    if (!validateAdminUser(adminCode, birthDate)) {
      return NextResponse.json({ error: "Admin authentication failed" }, { status: 403 });
    }
    const session = createSession({
      role: ROLE_ADMIN,
      accessType: "admin_code",
      userId: "admin:root",
      userName: "admin",
    });
    return NextResponse.json({
      accessToken: session.token,
      role: session.role,
      accessType: session.accessType,
      activated: true,
      capabilities: getCapabilities(session.role),
      expiresAt: session.expiresAt,
    });
  }

  return NextResponse.json({ error: "Unknown activation mode" }, { status: 400 });
}
