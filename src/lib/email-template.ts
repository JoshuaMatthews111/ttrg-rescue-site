// Branded TTRG email shell.
//
// Email clients are not browsers: Outlook renders with Word's engine. So this
// is table-based, inline-styled, no flexbox/grid, no external CSS, images with
// explicit widths.

const NAVY = "#1B2A4A";
const RED = "#C41E2A";
const LOGO = "https://teamtrainersrescuegroup.com/ttrg/ttrg-logo-circle.png";

export interface EmailContent {
  headline: string;
  /** paragraphs separated by blank lines */
  body: string;
  buttonLabel?: string;
  buttonUrl?: string;
  imageUrl?: string;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function buildEmailHtml(content: EmailContent, unsubscribeUrl: string): string {
  const paragraphs = content.body
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p =>
      `<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:26px;color:#333333;">${esc(p).replace(/\n/g, "<br>")}</p>`
    )
    .join("");

  const button = content.buttonLabel && content.buttonUrl
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
         <tr><td align="center" bgcolor="${RED}" style="border-radius:28px;">
           <a href="${esc(content.buttonUrl)}" style="display:inline-block;padding:14px 32px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:28px;">${esc(content.buttonLabel)}</a>
         </td></tr>
       </table>`
    : "";

  const image = content.imageUrl
    ? `<tr><td style="padding:0 0 20px;"><img src="${esc(content.imageUrl)}" width="560" style="display:block;width:100%;max-width:560px;height:auto;border-radius:12px;" alt=""></td></tr>`
    : "";

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(content.headline)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4;">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;">

      <tr><td align="center" bgcolor="${NAVY}" style="padding:24px;">
        <img src="${LOGO}" width="72" height="72" style="display:block;width:72px;height:72px;border-radius:36px;" alt="Team Trainers Rescue Group">
        <p style="margin:12px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#ffffff;letter-spacing:1px;">TEAM TRAINERS RESCUE GROUP</p>
      </td></tr>

      <tr><td style="padding:32px 32px 8px;">
        <h1 style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:24px;line-height:32px;color:${NAVY};">${esc(content.headline)}</h1>
      </td></tr>
      ${image ? `<tr><td style="padding:0 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${image}</table></td></tr>` : ""}
      <tr><td style="padding:0 32px 8px;">
        ${paragraphs}
        ${button}
      </td></tr>

      <tr><td style="padding:24px 32px 32px;border-top:1px solid #eeeeee;">
        <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:20px;color:#888888;">
          Team Trainers Rescue Group · 501(c)(3) nonprofit · Cleveland, OH
        </p>
        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:20px;color:#888888;">
          You are receiving this because you supported our rescue work.
          <a href="${esc(unsubscribeUrl)}" style="color:#888888;text-decoration:underline;">Unsubscribe</a>
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}
