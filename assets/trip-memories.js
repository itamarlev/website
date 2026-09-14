(() => {
  const tripSlug = "zurich-black-forest-alsace-2026";
  if (!window.location.pathname.includes(`/trips/${tripSlug}/`)) return;

  const apiRoot = `/api/trip-memories/${tripSlug}`;
  const maxFileBytes = 15 * 1024 * 1024;
  const supportedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"]);
  const dayState = new Map();

  const icon = (name) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#icon-${name}`);
    svg.append(use);
    return svg;
  };

  const setStatus = (element, message, tone = "") => {
    element.textContent = message;
    element.dataset.tone = tone;
  };

  const request = async (url, options) => {
    const response = await fetch(url, options);
    const isJson = response.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await response.json() : null;
    if (!response.ok) throw new Error(data?.error || "הפעולה לא הושלמה. נסו שוב.");
    return data;
  };

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(`${value.replace(" ", "T")}Z`);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("he-IL", {
      timeZone: "Europe/Zurich",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  const openLightbox = (src, alt) => {
    const lightbox = document.querySelector(".image-lightbox");
    const image = lightbox?.querySelector("img");
    const caption = lightbox?.querySelector("p");
    if (!lightbox || !image || !caption) return;
    image.src = src;
    image.alt = alt;
    caption.textContent = alt;
    lightbox.showModal();
  };

  const photoUrl = (id, download = false) => `${apiRoot}/photos/${encodeURIComponent(id)}${download ? "?download=1" : ""}`;

  const createPhotoCard = (photo, day) => {
    const figure = document.createElement("figure");
    figure.className = "memory-photo";

    const preview = document.createElement("button");
    preview.className = "memory-photo__preview";
    preview.type = "button";
    preview.setAttribute("aria-label", `הגדילו את ${photo.file_name}`);
    const image = document.createElement("img");
    image.src = photoUrl(photo.id);
    image.alt = photo.caption || `תמונה מיום ${day}`;
    image.loading = "lazy";
    image.decoding = "async";
    preview.append(image);
    preview.addEventListener("click", () => openLightbox(image.src, image.alt));
    image.addEventListener("error", () => {
      preview.disabled = true;
      preview.classList.add("is-unavailable");
      preview.setAttribute("aria-label", "תצוגה מקדימה אינה זמינה; אפשר להוריד את התמונה");
      preview.replaceChildren(icon("download"), document.createTextNode(" תצוגה מקדימה לא זמינה"));
    }, { once: true });

    const body = document.createElement("figcaption");
    body.className = "memory-photo__body";
    const label = document.createElement("label");
    label.className = "memory-field-label";
    label.textContent = "כיתוב לתמונה";
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 240;
    input.value = photo.caption || "";
    input.placeholder = "מה נרצה לזכור מהרגע הזה?";
    label.append(input);

    const meta = document.createElement("div");
    meta.className = "memory-photo__meta";
    const date = document.createElement("span");
    date.textContent = formatDate(photo.created_at);
    const actions = document.createElement("div");
    actions.className = "memory-photo__actions";

    const save = document.createElement("button");
    save.type = "button";
    save.className = "memory-link-button";
    save.textContent = "עדכון כיתוב";
    const download = document.createElement("a");
    download.className = "memory-link-button";
    download.href = photoUrl(photo.id, true);
    download.download = photo.file_name;
    download.append(icon("download"), document.createTextNode(" הורדה"));
    actions.append(save, download);
    meta.append(date, actions);

    const status = document.createElement("p");
    status.className = "memory-inline-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    save.addEventListener("click", async () => {
      save.disabled = true;
      setStatus(status, "שומר כיתוב…");
      try {
        await request(photoUrl(photo.id), {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ caption: input.value })
        });
        image.alt = input.value.trim() || `תמונה מיום ${day}`;
        setStatus(status, "הכיתוב עודכן ✓", "success");
      } catch (caught) {
        setStatus(status, caught.message, "error");
      } finally {
        save.disabled = false;
      }
    });

    body.append(label, meta, status);
    figure.append(preview, body);
    return figure;
  };

  const renderPhotos = (gallery, photos, day) => {
    gallery.replaceChildren();
    if (!photos.length) {
      const empty = document.createElement("p");
      empty.className = "memory-empty";
      empty.textContent = "עדיין אין תמונות מהיום הזה. מי יעלה את הראשונה?";
      gallery.append(empty);
      return;
    }
    photos.forEach((photo) => gallery.append(createPhotoCard(photo, day)));
  };

  const updateSummary = (details, photos) => {
    const count = details.querySelector("[data-memory-count]");
    if (!count) return;
    count.textContent = photos.length === 1 ? "תמונה אחת" : `${photos.length} תמונות`;
  };

  const loadDay = async (day, elements, force = false) => {
    const state = dayState.get(day);
    if (state?.loaded && !force) return;
    setStatus(elements.status, "טוען את הזיכרונות…");
    elements.panel.setAttribute("aria-busy", "true");
    try {
      const data = await request(`${apiRoot}/days/${day}`);
      elements.note.value = data.note || "";
      renderPhotos(elements.gallery, data.photos || [], day);
      updateSummary(elements.details, data.photos || []);
      dayState.set(day, { loaded: true });
      setStatus(elements.status, data.noteUpdatedAt ? `נשמר לאחרונה: ${formatDate(data.noteUpdatedAt)}` : "מוכן לזיכרונות שלכם");
    } catch (caught) {
      setStatus(elements.status, caught.message, "error");
    } finally {
      elements.panel.removeAttribute("aria-busy");
    }
  };

  const buildMemory = (chapter) => {
    const day = Number(chapter.dataset.day);
    const details = document.createElement("details");
    details.className = "day-memory";
    details.innerHTML = `
      <summary>
        <span class="day-memory__title"><svg aria-hidden="true"><use href="#icon-zoom"/></svg><b>הזיכרונות שלנו</b></span>
        <small data-memory-count>תמונות והערות</small>
        <svg aria-hidden="true"><use href="#icon-expand"/></svg>
      </summary>
      <div class="day-memory__panel">
        <div class="memory-heading">
          <div><span>יומן משותף · יום ${String(day).padStart(2, "0")}</span><h4>שומרים את מה שבאמת קרה</h4></div>
          <p>כל מי שיש לו גישה לעמוד יכול להוסיף ולעדכן.</p>
        </div>
        <section class="memory-note" aria-labelledby="memory-note-${day}">
          <label id="memory-note-${day}" for="memory-note-input-${day}">הערות מהיום</label>
          <textarea id="memory-note-input-${day}" maxlength="4000" rows="4" aria-describedby="memory-note-help-${day}" placeholder="רגע מצחיק, מקום שאהבנו, המלצה לפעם הבאה…"></textarea>
          <div class="memory-form-row">
            <span id="memory-note-help-${day}">עד 4,000 תווים · ההערה משותפת לכולם</span>
            <button class="memory-primary-button" type="button" data-save-note>שמירת ההערה</button>
          </div>
        </section>
        <section class="memory-photos" aria-labelledby="memory-photos-${day}">
          <div class="memory-photos__heading"><div><span class="memory-field-label" id="memory-photos-${day}">תמונות מהיום</span><small>JPG, PNG, WebP, GIF או HEIC · עד 15MB לתמונה</small></div></div>
          <label class="memory-upload" for="memory-upload-${day}">
            <svg aria-hidden="true"><use href="#icon-download"/></svg>
            <span><b>הוספת תמונות</b><small>אפשר לבחור כמה תמונות יחד</small></span>
            <input id="memory-upload-${day}" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.heic,.heif" multiple>
          </label>
          <div class="memory-gallery" data-memory-gallery></div>
        </section>
        <p class="memory-status" role="status" aria-live="polite"></p>
      </div>`;

    const panel = details.querySelector(".day-memory__panel");
    const note = details.querySelector("textarea");
    const saveNote = details.querySelector("[data-save-note]");
    const upload = details.querySelector("input[type=file]");
    const gallery = details.querySelector("[data-memory-gallery]");
    const status = details.querySelector(".memory-status");
    const elements = { details, panel, note, gallery, status };

    details.addEventListener("toggle", () => {
      if (details.open) loadDay(day, elements);
    });

    saveNote.addEventListener("click", async () => {
      saveNote.disabled = true;
      setStatus(status, "שומר את ההערה…");
      try {
        await request(`${apiRoot}/days/${day}`, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ note: note.value })
        });
        setStatus(status, "ההערה נשמרה לכולם ✓", "success");
      } catch (caught) {
        setStatus(status, caught.message, "error");
      } finally {
        saveNote.disabled = false;
      }
    });

    upload.addEventListener("change", async () => {
      const files = [...upload.files];
      if (!files.length) return;
      const invalid = files.find((file) => file.size > maxFileBytes || !supportedTypes.has(file.type));
      if (invalid) {
        setStatus(status, `${invalid.name}: אפשר להעלות JPG, PNG, WebP, GIF או HEIC עד 15MB.`, "error");
        upload.value = "";
        return;
      }

      upload.disabled = true;
      try {
        for (const [index, file] of files.entries()) {
          setStatus(status, `מעלה תמונה ${index + 1} מתוך ${files.length}…`);
          const form = new FormData();
          form.append("photo", file);
          await request(`${apiRoot}/days/${day}/photos`, { method: "POST", body: form });
        }
        dayState.set(day, { loaded: false });
        await loadDay(day, elements, true);
        setStatus(status, files.length === 1 ? "התמונה עלתה ✓" : `${files.length} התמונות עלו ✓`, "success");
      } catch (caught) {
        setStatus(status, caught.message, "error");
      } finally {
        upload.disabled = false;
        upload.value = "";
      }
    });

    const dayBody = chapter.querySelector(".day-body");
    const firstRouteButton = dayBody?.querySelector(":scope > .route-button");
    if (firstRouteButton) firstRouteButton.before(details);
    else dayBody?.append(details);
  };

  document.querySelectorAll(".day-chapter[data-day]").forEach(buildMemory);
})();
