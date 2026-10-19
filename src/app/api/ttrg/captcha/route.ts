import { captcha } from "@/lib/captcha";

export const dynamic = "force-dynamic";

/** Issues a fresh signed challenge for the "I'm not a robot" box. */
export async function GET(req: Request) {
  return captcha().challengeHandler(req);
}
