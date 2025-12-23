import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  console.log("[Upload] Starting upload...");
  
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("[Upload] No file in request");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("[Upload] File received:", file.name, file.type, file.size);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const ext = file.name.split('.').pop();
    const filename = `${crypto.randomUUID()}.${ext}`;
    const filePath = `projects/${filename}`;

    console.log("[Upload] Getting Supabase client...");
    
    // Get Supabase client (lazy initialization)
    const supabase = getSupabaseAdmin();

    console.log("[Upload] Uploading to Supabase Storage:", filePath);

    // Upload to Supabase Storage
    const { error, data } = await supabase.storage
      .from('uploads')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error("[Upload] Supabase error:", JSON.stringify(error));
      return NextResponse.json(
        { error: "Failed to upload to storage", details: error.message },
        { status: 500 }
      );
    }

    console.log("[Upload] Upload success:", data);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    console.log("[Upload] Public URL:", urlData.publicUrl);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error("[Upload] Catch error:", error);
    return NextResponse.json(
      { error: "Failed to upload image", details: String(error) },
      { status: 500 }
    );
  }
}
