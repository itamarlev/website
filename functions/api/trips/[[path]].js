const MAX_BODY_BYTES = 512 * 1024;
const ID_BYTES = 8;

const json = (data, init = {}) => {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(data), { ...init, headers });
};

const error = (message, status = 400) => json({ error: message }, { status });

const getRoute = (params) => {
  const path = Array.isArray(params.path) ? params.path : [params.path].filter(Boolean);
  const [id] = path;
  return { path, id };
};

const requireBindings = (env) => {
  if (!env.TRIP_MEMORIES_DB) {
    return error("אחסון הטיולים עדיין לא הוגדר.", 503);
  }
  return null;
};

const requireIngestAuth = (request, env) => {
  if (!env.TRIPS_INGEST_KEY) {
    return error("יצירת טיולים עדיין לא הוגדרה.", 503);
  }
  const header = request.headers.get("authorization") || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token || token !== env.TRIPS_INGEST_KEY) {
    return error("האימות נכשל.", 401);
  }
  return null;
};

const readJson = async (request) => {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) throw new Error("request_too_large");
  if (!request.headers.get("content-type")?.includes("application/json")) return null;
  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) throw new Error("request_too_large");
  try {
    return JSON.parse(body);
  } catch (_) {
    return null;
  }
};

const makeId = () => crypto.randomUUID().replace(/-/g, "").slice(0, ID_BYTES * 2);

const createTrip = async (request, env) => {
  const authError = requireIngestAuth(request, env);
  if (authError) return authError;

  let body;
  try {
    body = await readJson(request);
  } catch (caught) {
    return error(
      caught instanceof Error && caught.message === "request_too_large"
        ? "הבקשה גדולה מהמותר."
        : "לא ניתן לקרוא את גוף הבקשה.",
      caught instanceof Error && caught.message === "request_too_large" ? 413 : 400,
    );
  }

  if (!body || typeof body !== "object" || !body.trip || typeof body.trip !== "object") {
    return error("יש לשלוח טיול תקין.", 400);
  }

  const title = typeof body.title === "string" ? body.title.trim().slice(0, 200) : null;
  const id = makeId();

  try {
    await env.TRIP_MEMORIES_DB.prepare(
      `INSERT INTO generated_trips (id, source, title, trip_json)
       VALUES (?, 'wanderkind', ?, ?)`,
    )
      .bind(id, title, JSON.stringify(body.trip))
      .run();
  } catch (caught) {
    console.error(JSON.stringify({
      event: "generated_trip_insert_error",
      message: caught instanceof Error ? caught.message : "Unknown error",
    }));
    return error("אירעה תקלה בשמירת הטיול. נסו שוב בעוד רגע.", 500);
  }

  return json({ id, url: `https://itamarlev.com/trips/w/${id}` }, { status: 201 });
};

const getTrip = async (env, id) => {
  const row = await env.TRIP_MEMORIES_DB.prepare(
    "SELECT id, title, trip_json, created_at FROM generated_trips WHERE id = ?",
  )
    .bind(id)
    .first();

  if (!row) return error("הטיול לא נמצא.", 404);

  let trip;
  try {
    trip = JSON.parse(row.trip_json);
  } catch (_) {
    return error("הטיול השמור פגום.", 500);
  }

  return json({ id: row.id, title: row.title, trip, createdAt: row.created_at });
};

export async function onRequest(context) {
  const bindingError = requireBindings(context.env);
  if (bindingError) return bindingError;

  const { id } = getRoute(context.params);

  try {
    if (!id && context.request.method === "POST") {
      return await createTrip(context.request, context.env);
    }

    if (id && context.request.method === "GET") {
      return await getTrip(context.env, id);
    }

    return error("הפעולה לא נמצאה.", 404);
  } catch (caught) {
    console.error(JSON.stringify({
      event: "generated_trip_error",
      method: context.request.method,
      path: new URL(context.request.url).pathname,
      message: caught instanceof Error ? caught.message : "Unknown error",
    }));
    return error("אירעה תקלה. נסו שוב בעוד רגע.", 500);
  }
}
