const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const isHebrewLocale = (locale) => typeof locale === "string" && locale.toLowerCase().startsWith("he");

const formatDate = (isoDate, locale) => {
  if (!isoDate) return "";
  try {
    return new Intl.DateTimeFormat(isHebrewLocale(locale) ? "he-IL" : "en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${isoDate}T00:00:00Z`));
  } catch (_) {
    return isoDate;
  }
};

const notFoundPage = (locale = "en") => {
  const he = isHebrewLocale(locale);
  const html = `<!doctype html>
<html lang="${he ? "he" : "en"}" dir="${he ? "rtl" : "ltr"}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${he ? "הטיול לא נמצא" : "Trip not found"} — itamarlev.com</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: oklch(96.5% 0.012 218);
      color: oklch(22% 0.025 250);
      font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      text-align: center;
      padding: 32px;
    }
    .card {
      max-width: 420px;
      padding: 40px 32px;
      border-radius: 16px;
      background: oklch(99% 0.004 215);
      box-shadow: 0 22px 60px oklch(32% 0.04 230 / 0.12);
    }
    h1 { font-size: 1.6rem; margin: 0 0 12px; }
    p { margin: 0 0 20px; color: oklch(46% 0.03 236); }
    a {
      display: inline-block;
      padding: 10px 20px;
      border-radius: 8px;
      background: oklch(44% 0.13 39);
      color: white;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>${he ? "הטיול לא נמצא" : "Trip not found"}</h1>
    <p>${he ? "הקישור הזה לא תקין או שהטיול הוסר." : "This link is invalid or the trip has been removed."}</p>
    <a href="https://itamarlev.com/">itamarlev.com</a>
  </div>
</body>
</html>`;
  return new Response(html, {
    status: 404,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
};

const renderActivity = (activity, placesById, he) => {
  const place = placesById.get(activity.placeId);
  const placeName = place ? escapeHtml(place.name) : "";
  const intensityLabel = { low: he ? "קצב רגוע" : "Easy pace", medium: he ? "קצב בינוני" : "Moderate pace", high: he ? "קצב אינטנסיבי" : "Intensive pace" }[
    activity.intensity
  ];
  return `
    <li class="activity">
      <div class="activity__time">${escapeHtml(activity.startsAt)}–${escapeHtml(activity.endsAt)}</div>
      <div class="activity__body">
        <div class="activity__title">${escapeHtml(activity.title)}</div>
        ${placeName ? `<div class="activity__place">${placeName}</div>` : ""}
        <div class="activity__meta">
          ${intensityLabel ? `<span class="chip">${intensityLabel}</span>` : ""}
          ${activity.stepFreeAccess === "yes" ? `<span class="chip chip--step-free">${he ? "נגיש ללא מדרגות" : "Step-free"}</span>` : ""}
        </div>
      </div>
    </li>`;
};

const renderDay = (day, dayIndex, placesById, locale, he) => {
  const activities = Array.isArray(day.activities) ? day.activities : [];
  const sorted = [...activities].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  return `
    <section class="day" aria-labelledby="day-${dayIndex}-title">
      <h2 id="day-${dayIndex}-title" class="day__title">
        <span class="day__number">${he ? `יום ${dayIndex + 1}` : `Day ${dayIndex + 1}`}</span>
        <span class="day__date">${escapeHtml(formatDate(day.date, locale))}</span>
      </h2>
      <ul class="activity-list">
        ${sorted.map((activity) => renderActivity(activity, placesById, he)).join("")}
      </ul>
    </section>`;
};

const renderTripPage = (row) => {
  let trip;
  try {
    trip = JSON.parse(row.trip_json);
  } catch (_) {
    return notFoundPage();
  }

  const locale = trip.locale || "en";
  const he = isHebrewLocale(locale);
  const title = escapeHtml(row.title || trip.title || (he ? "טיול" : "Trip"));
  const places = Array.isArray(trip.places) ? trip.places : [];
  const placesById = new Map(places.map((place) => [place.id, place]));
  const days = Array.isArray(trip.days) ? trip.days : [];
  const dateRange =
    trip.startDate && trip.endDate
      ? `${formatDate(trip.startDate, locale)} ${he ? "עד" : "to"} ${formatDate(trip.endDate, locale)}`
      : "";
  const travelerCount = Array.isArray(trip.travelers) ? trip.travelers.length : null;

  const html = `<!doctype html>
<html lang="${he ? "he" : "en"}" dir="${he ? "rtl" : "ltr"}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${title}${dateRange ? ` — ${escapeHtml(dateRange)}` : ""}">
  <meta name="theme-color" content="#08110f">
  <meta name="robots" content="noindex">
  <title>${title} — itamarlev.com</title>
  <style>
    :root {
      --bg: oklch(96.5% 0.012 218);
      --surface: oklch(99% 0.004 215);
      --text: oklch(22% 0.025 250);
      --muted: oklch(46% 0.03 236);
      --faint: oklch(68% 0.025 228);
      --border: oklch(87% 0.022 215);
      --accent: oklch(44% 0.13 39);
      --green-soft: oklch(92% 0.045 170);
      --green: oklch(43% 0.105 170);
      --shadow: 0 22px 60px oklch(32% 0.04 230 / 0.12);
      --radius: 12px;
      color-scheme: light;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.6;
    }
    .shell { max-width: 760px; margin: 0 auto; padding: 32px 20px 80px; }
    .hero {
      padding: 36px 28px;
      border-radius: var(--radius);
      background: var(--surface);
      box-shadow: var(--shadow);
      margin-bottom: 28px;
    }
    .hero__eyebrow {
      display: inline-block;
      margin-bottom: 10px;
      padding: 4px 10px;
      border-radius: 999px;
      background: var(--green-soft);
      color: var(--green);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.04em;
    }
    .hero__title { margin: 0 0 8px; font-size: clamp(1.6rem, 4vw, 2.2rem); font-weight: 800; }
    .hero__meta { margin: 0; color: var(--muted); font-size: 0.98rem; }
    .day {
      padding: 24px 24px 8px;
      border-radius: var(--radius);
      background: var(--surface);
      box-shadow: var(--shadow);
      margin-bottom: 20px;
    }
    .day__title {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 14px;
      align-items: baseline;
      margin: 0 0 14px;
      font-size: 1.15rem;
    }
    .day__number { font-weight: 800; color: var(--accent); }
    .day__date { color: var(--muted); font-weight: 500; font-size: 0.95rem; }
    .activity-list { list-style: none; margin: 0; padding: 0; }
    .activity {
      display: grid;
      grid-template-columns: 96px 1fr;
      gap: 14px;
      padding: 14px 0;
      border-top: 1px solid var(--border);
    }
    .activity:first-child { border-top: none; }
    .activity__time { color: var(--muted); font-size: 0.86rem; font-weight: 700; white-space: nowrap; }
    .activity__title { font-weight: 700; margin-bottom: 2px; }
    .activity__place { color: var(--muted); font-size: 0.92rem; margin-bottom: 6px; }
    .activity__meta { display: flex; flex-wrap: wrap; gap: 6px; }
    .chip {
      display: inline-block;
      padding: 3px 9px;
      border-radius: 999px;
      background: var(--border);
      color: var(--muted);
      font-size: 0.74rem;
      font-weight: 700;
    }
    .chip--step-free { background: var(--green-soft); color: var(--green); }
    .footer {
      text-align: center;
      margin-top: 32px;
      color: var(--faint);
      font-size: 0.86rem;
    }
    .footer a { color: var(--accent); text-decoration: none; font-weight: 600; }
    @media (max-width: 520px) {
      .activity { grid-template-columns: 1fr; gap: 4px; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <header class="hero">
      <span class="hero__eyebrow">${he ? "מתוכנן עם Wanderkind" : "Planned with Wanderkind"}</span>
      <h1 class="hero__title">${title}</h1>
      <p class="hero__meta">
        ${escapeHtml(dateRange)}${travelerCount ? ` · ${travelerCount} ${he ? "נוסעים" : "travelers"}` : ""}
      </p>
    </header>

    <main>
      ${days.map((day, index) => renderDay(day, index, placesById, locale, he)).join("")}
    </main>

    <footer class="footer">
      <p>${he ? "נוצר על ידי" : "Generated with"} <a href="https://itamarlev.com/">itamarlev.com</a></p>
    </footer>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" },
  });
};

export async function onRequestGet(context) {
  const { id } = context.params;
  if (!id || typeof id !== "string") return notFoundPage();

  if (!context.env.TRIP_MEMORIES_DB) {
    return notFoundPage();
  }

  const row = await context.env.TRIP_MEMORIES_DB.prepare(
    "SELECT id, title, trip_json, created_at FROM generated_trips WHERE id = ?",
  )
    .bind(id)
    .first();

  if (!row) return notFoundPage();

  try {
    return renderTripPage(row);
  } catch (caught) {
    console.error(JSON.stringify({
      event: "generated_trip_render_error",
      id,
      message: caught instanceof Error ? caught.message : "Unknown error",
    }));
    return notFoundPage();
  }
}
