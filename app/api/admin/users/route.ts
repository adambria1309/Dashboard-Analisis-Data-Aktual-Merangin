import { FieldValue } from "firebase-admin/firestore";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getCurrentUser, isSameOriginRequest } from "@/lib/auth";
import { firestore } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const updateRoleSchema = z.object({
  uid: z.string().regex(/^[A-Za-z0-9_-]{1,128}$/),
  role: z.enum(["admin", "user"]),
});

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ message: "Silakan masuk." }, { status: 401 });
  }
  if (currentUser.role !== "admin") {
    return NextResponse.json({ message: "Akses khusus admin." }, { status: 403 });
  }

  const snapshot = await firestore
    .collection("users")
    .where("authProvider", "==", "firebase")
    .limit(200)
    .get();
  const users = snapshot.docs
    .map((document) => {
      const user = document.data();
      const createdAt = user.createdAt?.toDate?.();

      return {
        uid: document.id,
        name: typeof user.name === "string" ? user.name : "Pengguna",
        email: typeof user.email === "string" ? user.email : "",
        role: user.role === "admin" ? "admin" : "user",
        createdAt: createdAt instanceof Date ? createdAt.toISOString() : null,
      };
    })
    .filter((user) => user.email)
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));

  const response = NextResponse.json({ users });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function PATCH(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ message: "Permintaan tidak valid." }, { status: 403 });
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ message: "Silakan masuk." }, { status: 401 });
  }
  if (currentUser.role !== "admin") {
    return NextResponse.json({ message: "Akses khusus admin." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateRoleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Peran pengguna tidak valid." }, { status: 400 });
  }
  if (parsed.data.uid === currentUser.uid) {
    return NextResponse.json({ message: "Peran akun yang sedang digunakan tidak dapat diubah." }, { status: 400 });
  }

  const userRef = firestore.collection("users").doc(parsed.data.uid);
  const result = await firestore.runTransaction(async (transaction) => {
    const userSnapshot = await transaction.get(userRef);
    if (!userSnapshot.exists || userSnapshot.data()?.authProvider !== "firebase") {
      return "not-found";
    }

    const currentRole = userSnapshot.data()?.role;
    if (currentRole === parsed.data.role) return "unchanged";

    if (currentRole === "admin" && parsed.data.role === "user") {
      const profiles = await transaction.get(
        firestore.collection("users").where("authProvider", "==", "firebase"),
      );
      const adminCount = profiles.docs.filter(
        (profile) => profile.data().role === "admin",
      ).length;
      if (adminCount <= 1) return "last-admin";
    }

    transaction.update(userRef, {
      role: parsed.data.role,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return "updated";
  });

  if (result === "not-found") {
    return NextResponse.json({ message: "Pengguna tidak ditemukan." }, { status: 404 });
  }
  if (result === "last-admin") {
    return NextResponse.json({ message: "Setidaknya satu admin harus tetap aktif." }, { status: 409 });
  }

  const response = NextResponse.json({ ok: true, unchanged: result === "unchanged" });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
