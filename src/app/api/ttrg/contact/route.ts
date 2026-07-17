import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "Name, email, and message are required." }, { status: 400 });
    }

    // 1. Store in Supabase
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

    // 2. Send email notification to TTRG
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "TTRG Contact Form <onboarding@resend.dev>",
        to: ["info@teamtrainersrescuegroup.com"],
        subject: `New Contact: ${subject || "Website Inquiry"} — from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1B2A4A; border-bottom: 2px solid #C41E2A; padding-bottom: 8px;">
              New Contact Form Submission
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
              <tr><td style="padding: 8px 0; font-weight: bold; color: #1B2A4A;">Name:</td><td style="padding: 8px 0;">${name}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #1B2A4A;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #1B2A4A;">Phone:</td><td style="padding: 8px 0;">${phone}</td></tr>` : ""}
              ${subject ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #1B2A4A;">Subject:</td><td style="padding: 8px 0;">${subject}</td></tr>` : ""}
            </table>
            <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-top: 12px;">
              <p style="margin: 0 0 4px 0; font-weight: bold; color: #1B2A4A;">Message:</p>
              <p style="margin: 0; color: #333; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #888;">
              Sent from the TTRG website contact form on ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully. We will reach out to you at the email provided.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ success: false, error: "Failed to send message." }, { status: 500 });
  }
}
