const ALLOWED_TYPES = new Set(["auto", "health", "medicare", "life", "dental", "home"]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value) {
  return clean(value).toLowerCase();
}

function digits(value) {
  return clean(value).replace(/\D/g, "");
}

function toE164US(value) {
  const onlyDigits = digits(value);
  if (onlyDigits.length === 10) return `+1${onlyDigits}`;
  if (onlyDigits.length === 11 && onlyDigits.startsWith("1")) return `+${onlyDigits}`;
  return null;
}

function splitName(fullName) {
  const parts = clean(fullName).split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first_name: null, last_name: null };
  if (parts.length === 1) return { first_name: parts[0], last_name: null };
  return {
    first_name: parts.slice(0, -1).join(" "),
    last_name: parts[parts.length - 1],
  };
}

function clientIp(request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for") ||
    ""
  );
}

export async function onRequestPost({ request, env }) {
  let body;

  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body." }, 400);
  }

  if (clean(body.company)) {
    return json({ ok: true });
  }

  const fullName = clean(body.fullName);
  const phone = clean(body.phone);
  const email = normalizeEmail(body.email);
  const insuranceType = clean(body.insuranceType);
  const consent = Boolean(body.consent);

  if (!fullName || !phone || !email || !ALLOWED_TYPES.has(insuranceType) || !consent) {
    return json(
      {
        ok: false,
        error: "Name, phone, email, insurance type, and consent are required.",
      },
      400
    );
  }

  if (!env.LEADS_API_BASE_URL || !env.LEADS_API_KEY) {
    return json({ ok: false, error: "Lead routing is not configured." }, 500);
  }

  const names = splitName(fullName);
  const now = new Date().toISOString();
  const phoneE164 = toE164US(phone);
  const lang = clean(body.language) || "es";
  const message = clean(body.message);
  const city = clean(body.city);
  const state = clean(body.state);
  const zipCode = clean(body.zipCode);
  const utm = typeof body.utm === "object" && body.utm ? body.utm : {};

  const payload = {
    ...names,
    full_name: fullName,
    phone,
    phone_e164: phoneE164,
    email,
    email_normalized: email,
    city: city || null,
    state: state || null,
    zip_code: zipCode || null,
    language: lang,
    source: "laguiadeseguros.com",
    tag: `website:${insuranceType}`,
    status: "active",
    subscribed_sms: true,
    subscribed_email: true,
    opted_out_sms: false,
    opted_out_email: false,
    consent_timestamp: now,
    consent_source: "laguiadeseguros.com lead form",
    notes: [
      `Website lead for ${insuranceType} insurance.`,
      message ? `Message: ${message}` : null,
      `Preferred language: ${lang}`,
    ]
      .filter(Boolean)
      .join("\n"),
    custom_fields: {
      insurance_type: insuranceType,
      preferred_contact: clean(body.preferredContact) || null,
      household_size: clean(body.householdSize) || null,
      current_coverage: clean(body.currentCoverage) || null,
      page_path: clean(body.pagePath) || "/",
      referrer: clean(body.referrer) || null,
      utm_source: clean(utm.utm_source) || null,
      utm_medium: clean(utm.utm_medium) || null,
      utm_campaign: clean(utm.utm_campaign) || null,
      utm_content: clean(utm.utm_content) || null,
      utm_term: clean(utm.utm_term) || null,
      cf_ray: request.headers.get("cf-ray") || null,
      client_ip: clientIp(request),
    },
  };

  const baseUrl = env.LEADS_API_BASE_URL.replace(/\/+$/, "");
  const response = await fetch(`${baseUrl}/api/leads/upsert`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.LEADS_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Lead API error", response.status, text.slice(0, 500));
    return json({ ok: false, error: "Unable to create lead." }, 502);
  }

  const result = await response.json();
  return json({ ok: true, leadId: result?.item?.id || null }, 201);
}

export async function onRequestGet() {
  return json({ ok: true, service: "laguiadeseguros lead intake" });
}
