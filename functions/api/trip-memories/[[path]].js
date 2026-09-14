const SUPPORTED_TRIPS = new Map([
  ["zurich-black-forest-alsace-2026", 11]
]);

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const MAX_NOTE_LENGTH = 4000;
const MAX_CAPTION_LENGTH = 240;
const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif"
]);

const json = (data, init = {}) => {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(data), { ...init, headers });
};

const error = (message, status = 400) => json({ error: message }, { status });

const getRoute = (params) => {
  const path = Array.isArray(params.path) ? params.path : [params.path].filter(Boolean);
  const [trip, resource, value, action] = path;
  return { path, trip, resource, value, action };
};

const validDay = (trip, value) => {
  const day = Number(value);
  const lastDay = SUPPORTED_TRIPS.get(trip);
  return Number.isInteger(day) && lastDay && day >= 1 && day <= lastDay ? day : null;
};

const requireBindings = (env) => {
  if (!env.TRIP_MEMORIES_DB || !env.TRIP_MEMORIES_BUCKET) {
    return error("אחסון הזיכרונות עדיין לא הוגדר.", 503);
  }
  return null;
};

const safeFileName = (name) => {
  const cleaned = String(name || "photo")
    .normalize("NFKC")
    .replace(/[\\/\u0000-\u001f\u007f]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
  return cleaned || "photo";
};

const contentDisposition = (fileName, download) => {
  const fallback = fileName.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_");
  const encoded = encodeURIComponent(fileName).replace(/['()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
  return `${download ? "attachment" : "inline"}; filename="${fallback}"; filename*=UTF-8''${encoded}`;
};

const readJson = async (request) => {
  if (!request.headers.get("content-type")?.includes("application/json")) return null;
  try {
    return await request.json();
  } catch (_) {
    return null;
  }
};

const isCrossSiteMutation = (request) => {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return false;
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  return fetchSite === "cross-site" || (origin && origin !== new URL(request.url).origin);
};

const listDay = async (env, trip, day) => {
  const [note, photos] = await env.TRIP_MEMORIES_DB.batch([
    env.TRIP_MEMORIES_DB.prepare(
      "SELECT note, updated_at FROM trip_day_notes WHERE trip_slug = ? AND day_number = ?"
    ).bind(trip, day),
    env.TRIP_MEMORIES_DB.prepare(
      `SELECT id, file_name, content_type, size_bytes, caption, created_at, updated_at
       FROM trip_photos
       WHERE trip_slug = ? AND day_number = ?
       ORDER BY created_at DESC`
    ).bind(trip, day)
  ]);

  return json({
    day,
    note: note.results?.[0]?.note || "",
    noteUpdatedAt: note.results?.[0]?.updated_at || null,
    photos: photos.results || []
  });
};

const saveNote = async (request, env, trip, day) => {
  const body = await readJson(request);
  if (!body || typeof body.note !== "string") return error("יש לשלוח הערה תקינה.");
  const note = body.note.trim();
  if (note.length > MAX_NOTE_LENGTH) return error(`ההערה יכולה להכיל עד ${MAX_NOTE_LENGTH} תווים.`);

  await env.TRIP_MEMORIES_DB.prepare(
    `INSERT INTO trip_day_notes (trip_slug, day_number, note, updated_at)
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT (trip_slug, day_number)
     DO UPDATE SET note = excluded.note, updated_at = CURRENT_TIMESTAMP`
  ).bind(trip, day, note).run();

  return json({ note, saved: true });
};

const uploadPhoto = async (request, env, trip, day) => {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_IMAGE_BYTES + 1024 * 1024) return error("התמונה גדולה מ־15MB.", 413);

  let form;
  try {
    form = await request.formData();
  } catch (_) {
    return error("לא ניתן לקרוא את קובץ התמונה.");
  }

  const file = form.get("photo");
  if (!(file instanceof File) || !file.size) return error("יש לבחור תמונה להעלאה.");
  if (file.size > MAX_IMAGE_BYTES) return error("התמונה גדולה מ־15MB.", 413);
  if (!IMAGE_TYPES.has(file.type)) return error("אפשר להעלות JPG, PNG, WebP, GIF או HEIC בלבד.", 415);

  const captionValue = form.get("caption");
  const caption = typeof captionValue === "string" ? captionValue.trim() : "";
  if (caption.length > MAX_CAPTION_LENGTH) return error(`הכיתוב יכול להכיל עד ${MAX_CAPTION_LENGTH} תווים.`);

  const id = crypto.randomUUID();
  const fileName = safeFileName(file.name);
  const objectKey = `${trip}/day-${day}/${id}-${fileName}`;

  await env.TRIP_MEMORIES_BUCKET.put(objectKey, file.stream(), {
    httpMetadata: {
      contentType: file.type,
      cacheControl: "private, max-age=3600"
    },
    customMetadata: { trip, day: String(day), photoId: id }
  });

  try {
    await env.TRIP_MEMORIES_DB.prepare(
      `INSERT INTO trip_photos
       (id, trip_slug, day_number, object_key, file_name, content_type, size_bytes, caption)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, trip, day, objectKey, fileName, file.type, file.size, caption).run();
  } catch (databaseError) {
    await env.TRIP_MEMORIES_BUCKET.delete(objectKey);
    throw databaseError;
  }

  return json({ id, uploaded: true }, { status: 201 });
};

const findPhoto = (env, trip, photoId) => env.TRIP_MEMORIES_DB.prepare(
  `SELECT id, object_key, file_name, content_type, caption
   FROM trip_photos WHERE trip_slug = ? AND id = ?`
).bind(trip, photoId).first();

const servePhoto = async (request, env, trip, photoId) => {
  const photo = await findPhoto(env, trip, photoId);
  if (!photo) return error("התמונה לא נמצאה.", 404);

  const object = await env.TRIP_MEMORIES_BUCKET.get(photo.object_key);
  if (!object) return error("קובץ התמונה לא נמצא.", 404);

  const hasBody = "body" in object;
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "private, max-age=3600");
  headers.set("content-disposition", contentDisposition(photo.file_name, new URL(request.url).searchParams.has("download")));
  headers.set("x-content-type-options", "nosniff");
  return new Response(hasBody ? object.body : undefined, { status: hasBody ? 200 : 412, headers });
};

const updateCaption = async (request, env, trip, photoId) => {
  const body = await readJson(request);
  if (!body || typeof body.caption !== "string") return error("יש לשלוח כיתוב תקין.");
  const caption = body.caption.trim();
  if (caption.length > MAX_CAPTION_LENGTH) return error(`הכיתוב יכול להכיל עד ${MAX_CAPTION_LENGTH} תווים.`);

  const result = await env.TRIP_MEMORIES_DB.prepare(
    `UPDATE trip_photos SET caption = ?, updated_at = CURRENT_TIMESTAMP
     WHERE trip_slug = ? AND id = ?`
  ).bind(caption, trip, photoId).run();

  if (!result.meta?.changes) return error("התמונה לא נמצאה.", 404);
  return json({ caption, saved: true });
};

export async function onRequest(context) {
  const bindingError = requireBindings(context.env);
  if (bindingError) return bindingError;
  if (isCrossSiteMutation(context.request)) return error("הפעולה נחסמה מטעמי אבטחה.", 403);

  const { path, trip, resource, value, action } = getRoute(context.params);
  if (!SUPPORTED_TRIPS.has(trip)) return error("הטיול לא נמצא.", 404);

  try {
    if (resource === "days" && path.length === 3) {
      const day = validDay(trip, value);
      if (!day) return error("היום לא נמצא.", 404);
      if (context.request.method === "GET") return await listDay(context.env, trip, day);
      if (context.request.method === "PUT") return await saveNote(context.request, context.env, trip, day);
    }

    if (resource === "days" && action === "photos" && path.length === 4) {
      const day = validDay(trip, value);
      if (!day) return error("היום לא נמצא.", 404);
      if (context.request.method === "POST") return await uploadPhoto(context.request, context.env, trip, day);
    }

    if (resource === "photos" && value && path.length === 3) {
      if (context.request.method === "GET") return await servePhoto(context.request, context.env, trip, value);
      if (context.request.method === "PATCH") return await updateCaption(context.request, context.env, trip, value);
    }

    return error("הפעולה לא נמצאה.", 404);
  } catch (caught) {
    console.error(JSON.stringify({
      event: "trip_memory_error",
      method: context.request.method,
      path: new URL(context.request.url).pathname,
      message: caught instanceof Error ? caught.message : "Unknown error"
    }));
    return error("אירעה תקלה בשמירת הזיכרון. נסו שוב בעוד רגע.", 500);
  }
}
