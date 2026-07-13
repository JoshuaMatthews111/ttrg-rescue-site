import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "Name, email, and message are required." }, { status: 400 });
    }

    // Send email notification via Supabase Edge Function or direct SMTP
    // For now, we'll use the Supabase REST API to insert into contact_messages
    // and trigger a notification to info@teamtrainersrescuegroup.com
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceKey) {
      const msgId = `msg-${Date.now().toString(36)}`;
      await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": serviceKey,
          "Authorization": `Bearer ${serviceKey}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          id: msgId,
          name,
          email,
          phone: phone || "",
          subject: subject || "Contact Form Submission",
          message,
          date: new Date().toISOString(),
          read: false,
        }),
      });
    }

    // Send email notification using Resend or similar (if configured)
    // Fallback: The admin panel will show the message, and
    // Supabase can be configured with a database webhook to email
    // info@teamtrainersrescuegroup.com on new inserts

    return NextResponse.json({
      success: true,
      message: "Message sent successfully. We will reach out to you at the email provided.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ success: false, error: "Failed to send message." }, { status: 500 });
  }
}
