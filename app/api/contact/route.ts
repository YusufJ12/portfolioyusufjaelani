import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";

// GET /api/contact - Get all contact messages
export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST /api/contact - Create new contact message (from contact form)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (
      name.length > 50 ||
      subject.length > 100 ||
      message.length > 1000 ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Invalid contact form data" },
        { status: 400 }
      );
    }

    const savedMessage = await db.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    const web3FormsKey =
      process.env.WEB3FORMS_ACCESS_KEY ||
      process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

    if (web3FormsKey) {
      try {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: web3FormsKey,
            name,
            email,
            subject,
            message,
            from_name: "Portfolio Contact Form",
          }),
          signal: AbortSignal.timeout(5000),
        });
      } catch (error) {
        console.error("Web3Forms notification failed:", error);
      }
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully", data: savedMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
