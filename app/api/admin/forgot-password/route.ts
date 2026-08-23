import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// POST /api/admin/forgot-password - Langsung reset password admin tanpa hambatan
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, newPassword } = body;

    if (!email || !newPassword || typeof newPassword !== "string") {
      return NextResponse.json(
        { error: "Email dan password baru wajib diisi" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password baru minimal 6 karakter" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Cari admin yang ada di database
    let admin = await db.admin.findUnique({
      where: { email: normalizedEmail },
    });

    if (!admin) {
      // Jika email belum sesuai, ambil akun admin yang ada di database
      admin = await db.admin.findFirst();
    }

    if (admin) {
      // Update email & password hash admin
      await db.admin.update({
        where: { id: admin.id },
        data: {
          email: normalizedEmail,
          passwordHash,
        },
      });
    } else {
      // Jika belum ada data admin sama sekali, buat baru
      await db.admin.create({
        data: {
          email: normalizedEmail,
          passwordHash,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Password berhasil diperbarui! Silakan login dengan password baru Anda.",
    });
  } catch (error) {
    console.error("[ResetPassword] Error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui password ke database. Pastikan koneksi database aktif." },
      { status: 500 }
    );
  }
}
