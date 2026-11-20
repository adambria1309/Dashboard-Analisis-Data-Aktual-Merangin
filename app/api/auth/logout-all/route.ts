import { NextResponse, type NextRequest } from "next/server";
import {
  getCurrentUser,
  isSameOriginRequest,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";
import { firebaseAuth } from "@/lib/firebase-admin";

export const runtime = "nodejs";

function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ message: "Permintaan tidak valid." }, { status: 403 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return clearSessionCookie(
      NextResponse.json(
        {
          message: "Sesi ini sudah tidak aktif. Masuk kembali untuk memastikan semua perangkat keluar.",
          currentDeviceSignedOut: true,
        },
        { status: 401 },
      ),
    );
  }

  try {
    await firebaseAuth.revokeRefreshTokens(user.uid);
    return clearSessionCookie(NextResponse.json({ ok: true }));
  } catch {
    return clearSessionCookie(
      NextResponse.json(
        {
          message: "Perangkat ini sudah keluar, tetapi sesi di perangkat lain belum berhasil dicabut.",
          currentDeviceSignedOut: true,
        },
        { status: 503 },
      ),
    );
  }
}
