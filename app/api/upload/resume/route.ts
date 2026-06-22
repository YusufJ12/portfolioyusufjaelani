import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const MAX_PDF_SIZE = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf" || file.size > MAX_PDF_SIZE) {
      return NextResponse.json(
        { error: "Only PDF files up to 10 MB are allowed" },
        { status: 400 }
      );
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const blob = await put(`resumes/${safeName}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Resume upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload resume" },
      { status: 500 }
    );
  }
}
