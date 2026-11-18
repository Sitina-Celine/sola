// POST /api/lead  { email, source, ...extra }
// Accepts an email from the page. There is no database in this project:
// if LEADS_WEBHOOK_URL is set (for example a Klaviyo, Mailchimp, Zapier or Make webhook),
// the email is forwarded there. Otherwise it is only checked and logged, so the demo still works.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  if (!EMAIL.test(email) || email.length > 200) {
    res.status(400).json({ error: "Please enter a valid email." });
    return;
  }
  const source = typeof req.body?.source === "string" ? req.body.source.slice(0, 40) : "page";
  const extra = req.body?.extra && typeof req.body.extra === "object" ? JSON.parse(JSON.stringify(req.body.extra).slice(0, 2000)) : {};

  const hook = process.env.LEADS_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, extra, at: new Date().toISOString() }),
      });
    } catch (err) {
      // The visitor still gets their code; the failed forward is logged for the owner
      console.error("Lead webhook error:", err.message);
    }
  } else {
    console.log(`Lead captured (${source}): ${email.replace(/(.).+(@.+)/, "$1***$2")}`);
  }
  res.status(200).json({ ok: true });
}
