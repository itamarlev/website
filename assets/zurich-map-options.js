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
    .provider-link {
      display:inline-grid;
      width:30px;
      height:30px;
      flex:0 0 30px;
      place-items:center;
      padding:0;
      border:1px solid color-mix(in srgb, var(--trip-pine) 28%, var(--trip-line));
      border-radius:9px;
      background:var(--trip-paper-bright);
      color:var(--trip-navy);
      text-decoration:none;
      box-shadow:0 3px 10px rgba(35,42,73,.07);
      transition:transform .16s ease, background-color .16s ease, border-color .16s ease;
    }
    .provider-link:hover,
    .provider-link:focus-visible {
      border-color:color-mix(in srgb, var(--trip-pine) 58%, var(--trip-line));
      background:var(--trip-sky);
      color:var(--trip-navy);
      transform:translateY(-1px);
    }
    .provider-link img {
      display:block;
      width:16px;
      height:16px;
      object-fit:contain;
    }
    .provider-link--waze img { width:17px; height:17px; }
    .place-title-row {
      grid-column:1;
      display:flex;
      min-width:0;
      gap:6px;
      align-items:center;
      flex-wrap:wrap;
    }
    .place-title-row > a:first-child { min-width:0; }
    .route-map-row {
      display:flex;
      width:100%;
      gap:7px;
      align-items:center;
      flex-wrap:wrap;
      margin-top:auto;
      padding-top:20px;
    }
    .route-map-row .route-button {
      margin-top:0;
      padding-top:0;
    }
    .hotel-links .provider-link,
    .map-actions .provider-link {
      width:30px;
      height:30px;
      min-height:30px;
      padding:0;
    }
    @media(max-width:520px) {
      .day-nav__track a .day-weekday-nav { font-size:.62rem; }
      .provider-link { width:28px; height:28px; flex-basis:28px; }
      .provider-link img { width:15px; height:15px; }
      .place-title-row { gap:5px; }
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

  const providerLink = (href, label, className, iconUrl) => {
    const link = document.createElement("a");
    link.className = `provider-link ${className}`;
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", label);
    link.title = label;

    const icon = document.createElement("img");
    icon.src = iconUrl;
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
    link.append(icon);
    return link;
  };

  const appleLink = (href) => providerLink(
    href,
    "פתחו ב-Apple Maps",
    "provider-link--apple",
    "https://cdn.simpleicons.org/apple/273256"
  );

  const wazeLink = (href) => providerLink(
    href,
    "פתחו ב-Waze",
    "provider-link--waze",
    "https://cdn.simpleicons.org/waze/33CCFF"
  );

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
    if (googleLink.closest(".route-map-row")) return;
    const data = routeDataFromGoogle(googleLink.href);
    if (!data?.destination) return;

    const row = document.createElement("div");
    row.className = "route-map-row";
    googleLink.insertAdjacentElement("beforebegin", row);
    row.append(googleLink);
    row.append(appleLink(appleDirections(data)));
    const waze = wazeLink(wazeDirections(data.destination));
    if (data.waypoints.length) {
      waze.title = "פתחו ב-Waze ליעד האחרון; לעצירות הביניים השתמשו באייקונים ליד כל מקום";
      waze.setAttribute("aria-label", waze.title);
    }
    row.append(waze);
  });

  document.querySelectorAll(".day-points li").forEach((item) => {
    if (item.querySelector(".place-title-row")) return;
    const googleLink = item.querySelector(":scope > a[href*='google.com/maps']");
    if (!googleLink) return;
    const destination = googleLink.textContent.trim();
    if (!destination) return;

    const titleRow = document.createElement("div");
    titleRow.className = "place-title-row";
    googleLink.insertAdjacentElement("beforebegin", titleRow);
    titleRow.append(googleLink);
    titleRow.append(appleLink(appleDirections({ destination })));
    titleRow.append(wazeLink(wazeDirections(destination)));
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
    googleLink.after(
      appleLink(appleDirections({ destination })),
      wazeLink(wazeDirections(destination))
    );
  });
})();