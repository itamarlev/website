(() => {
  if (!window.location.pathname.includes("/trips/zurich-black-forest-alsace-2026/")) return;

  const days = {
    1: { weekday: "יום שלישי", date: "22/09", longDate: "22 בספטמבר" },
    2: { weekday: "יום רביעי", date: "23/09", longDate: "23 בספטמבר" },
    3: { weekday: "יום חמישי", date: "24/09", longDate: "24 בספטמבר" },
    4: { weekday: "יום שישי", date: "25/09", longDate: "25 בספטמבר" },
    5: { weekday: "שבת", date: "26/09", longDate: "26 בספטמבר" },
    6: { weekday: "יום ראשון", date: "27/09", longDate: "27 בספטמבר" },
    7: { weekday: "יום שני", date: "28/09", longDate: "28 בספטמבר" },
    8: { weekday: "יום שלישי", date: "29/09", longDate: "29 בספטמבר" },
    9: { weekday: "יום רביעי", date: "30/09", longDate: "30 בספטמבר" },
    10: { weekday: "יום חמישי", date: "01/10", longDate: "1 באוקטובר" },
    11: { weekday: "יום שישי", date: "02/10", longDate: "2 באוקטובר" }
  };

  const style = document.createElement("style");
  style.textContent = `
    .day-nav__track a .day-weekday-nav {
      display:block;
      margin-top:2px;
      color:rgba(255,255,255,.72);
      font-size:.66rem;
      font-style:normal;
      font-weight:750;
      line-height:1.15;
      white-space:nowrap;
    }
    .day-nav__track a[aria-current="step"] .day-weekday-nav { color:var(--trip-muted); }
    .day-date-label {
      margin:0 0 10px;
      color:var(--trip-pine);
      font-size:.82rem;
      font-weight:850;
    }
    .provider-links {
      display:flex;
      flex-wrap:wrap;
      gap:8px;
      align-items:center;
      margin-top:10px;
    }
    .provider-links__label {
      color:var(--trip-muted);
      font-size:.74rem;
      font-weight:800;
    }
    .provider-link {
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-height:38px;
      padding:0 12px;
      border:1px solid color-mix(in srgb, var(--trip-pine) 30%, var(--trip-line));
      border-radius:999px;
      background:var(--trip-paper-bright);
      color:var(--trip-navy);
      font-size:.76rem;
      font-weight:850;
      text-decoration:none;
      white-space:nowrap;
    }
    .provider-link:hover { background:var(--trip-sky); color:var(--trip-navy); }
    .provider-link--apple::before { content:"Apple"; margin-inline-end:6px; font-size:.62rem; opacity:.72; }
    .provider-link--waze::before { content:"W"; margin-inline-end:6px; font-size:.7rem; color:var(--trip-pine); }
    .route-provider-links {
      margin-top:10px;
      padding:12px 14px;
      border:1px solid var(--trip-line);
      border-radius:14px;
      background:color-mix(in srgb, var(--trip-sky) 42%, var(--trip-paper-bright));
    }
    .route-provider-note {
      flex-basis:100%;
      margin:0;
      color:var(--trip-muted);
      font-size:.68rem;
      line-height:1.45;
    }
    .point-provider-links {
      grid-column:1 / -1;
      margin-top:4px;
    }
    .point-provider-links .provider-link { min-height:32px; padding:0 10px; font-size:.7rem; }
    .hotel-links .provider-link,
    .map-actions .provider-link { min-height:36px; }
    @media(max-width:520px) {
      .day-nav__track a .day-weekday-nav { font-size:.62rem; }
      .provider-links { gap:6px; }
      .provider-link { min-height:36px; padding:0 10px; }
    }
  `;
  document.head.append(style);

  Object.entries(days).forEach(([dayNumber, info]) => {
    const navLink = document.querySelector(`[data-day-link="${dayNumber}"]`);
    if (navLink && !navLink.querySelector(".day-weekday-nav")) {
      const date = navLink.querySelector("span");
      const weekday = document.createElement("i");
      weekday.className = "day-weekday-nav";
      weekday.textContent = info.weekday;
      date?.insertAdjacentElement("beforebegin", weekday);
    }

    const chapter = document.getElementById(`day-${dayNumber}`);
    const body = chapter?.querySelector(".day-body");
    if (body && !body.querySelector(".day-date-label")) {
      const label = document.createElement("p");
      label.className = "day-date-label";
      label.textContent = `${info.weekday} · ${info.longDate} 2026`;
      body.prepend(label);
    }
  });

  const appleDirections = ({ source, destination, waypoints = [] }) => {
    const params = new URLSearchParams();
    if (source) params.set("source", source);
    if (destination) params.set("destination", destination);
    params.set("mode", "driving");
    waypoints.filter(Boolean).forEach((waypoint) => params.append("waypoint", waypoint));
    return `https://maps.apple.com/directions?${params.toString()}`;
  };

  const wazeDirections = (destination) => {
    const params = new URLSearchParams({
      q: destination,
      navigate: "yes",
      utm_source: "itamarlev.com"
    });
    return `https://waze.com/ul?${params.toString()}`;
  };

  const providerLink = (href, label, className) => {
    const link = document.createElement("a");
    link.className = `provider-link ${className}`;
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    return link;
  };

  const routeDataFromGoogle = (href) => {
    try {
      const url = new URL(href);
      const source = url.searchParams.get("origin") || "";
      const destination = url.searchParams.get("destination") || "";
      const rawWaypoints = url.searchParams.get("waypoints") || "";
      const waypoints = rawWaypoints ? rawWaypoints.split("|").filter(Boolean) : [];
      return { source, destination, waypoints };
    } catch (_) {
      return null;
    }
  };

  document.querySelectorAll(".day-chapter .route-button[href*='google.com/maps/dir']").forEach((googleLink) => {
    if (googleLink.nextElementSibling?.classList.contains("route-provider-links")) return;
    const data = routeDataFromGoogle(googleLink.href);
    if (!data?.destination) return;

    const row = document.createElement("div");
    row.className = "provider-links route-provider-links";
    const label = document.createElement("span");
    label.className = "provider-links__label";
    label.textContent = "אותו מסלול גם ב:";
    row.append(label);
    row.append(providerLink(appleDirections(data), "Apple Maps", "provider-link--apple"));
    row.append(providerLink(wazeDirections(data.destination), "Waze", "provider-link--waze"));

    if (data.waypoints.length) {
      const note = document.createElement("p");
      note.className = "route-provider-note";
      note.textContent = "Apple Maps שומר את עצירות הביניים. Waze נפתח ליעד האחרון בלבד; השתמשו בקישורי הנקודות למעבר בין העצירות.";
      row.append(note);
    }
    googleLink.insertAdjacentElement("afterend", row);
  });

  document.querySelectorAll(".day-points li").forEach((item) => {
    if (item.querySelector(".point-provider-links")) return;
    const googleLink = item.querySelector(":scope > a[href*='google.com/maps']");
    if (!googleLink) return;
    const destination = googleLink.textContent.trim();
    if (!destination) return;

    const row = document.createElement("div");
    row.className = "provider-links point-provider-links";
    const label = document.createElement("span");
    label.className = "provider-links__label";
    label.textContent = "ניווט:";
    row.append(label);
    row.append(providerLink(appleDirections({ destination }), "Apple Maps", "provider-link--apple"));
    row.append(providerLink(wazeDirections(destination), "Waze", "provider-link--waze"));
    item.append(row);
  });

  const queryFromGoogle = (href, fallback = "") => {
    try {
      const url = new URL(href);
      return url.searchParams.get("query") || url.searchParams.get("destination") || fallback;
    } catch (_) {
      return fallback;
    }
  };

  document.querySelectorAll(".hotel-links a[href*='google.com/maps'], .map-actions a[href*='google.com/maps']").forEach((googleLink) => {
    const parent = googleLink.parentElement;
    if (!parent || parent.querySelector(".provider-link--apple")) return;
    const destination = queryFromGoogle(googleLink.href, googleLink.textContent.trim());
    if (!destination) return;
    parent.append(providerLink(appleDirections({ destination }), "Apple Maps", "provider-link--apple"));
    parent.append(providerLink(wazeDirections(destination), "Waze", "provider-link--waze"));
  });
})();