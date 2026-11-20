import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const response = NextResponse.json({ user: await getCurrentUser() });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
