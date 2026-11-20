export function getFirebaseAuthErrorMessage(error: unknown, fallback: string) {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String(error.code)
      : "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Email atau kata sandi salah.";
    case "auth/email-already-in-use":
      return "Email sudah terdaftar. Silakan masuk dengan akun tersebut.";
    case "auth/invalid-email":
      return "Masukkan alamat email yang valid.";
    case "auth/weak-password":
      return "Gunakan kata sandi yang lebih kuat.";
    case "auth/email-not-verified":
      return "Verifikasi alamat email melalui tautan yang dikirim sebelum masuk.";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.";
    case "auth/network-request-failed":
      return "Tidak dapat terhubung ke Firebase. Periksa koneksi Anda.";
    case "auth/operation-not-allowed":
      return "Login email dan kata sandi belum diaktifkan di Firebase.";
    default:
      return fallback;
  }
}
