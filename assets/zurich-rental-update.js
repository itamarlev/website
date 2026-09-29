(() => {
  if (!window.location.pathname.includes("/trips/zurich-black-forest-alsace-2026/")) return;

  const replaceText = (root, replacements) => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      let value = node.nodeValue || "";
      replacements.forEach(([from, to]) => { value = value.split(from).join(to); });
      node.nodeValue = value;
    });
  };

  const replacements = [
    ["VW Passat Estate or similar", "BMW X3, Mercedes-Benz GLC או רכב דומה"],
    ["VW Passat Estate", "BMW X3, Mercedes-Benz GLC או רכב דומה"],
    ["Passat Estate", "Premium Elite SUV"],
    ["CHF 1,099.60", "CHF 1,310.99"],
    ["CHF 1’099.60", "CHF 1’310.99"],
    ["CHF 1099.60", "CHF 1’310.99"],
    ["פיקדון CHF 300", "פיקדון CHF 500"],
    ["CHF 300 פיקדון", "CHF 500 פיקדון"]
  ];

  replaceText(document.getElementById("bookings"), replacements);
  replaceText(document.getElementById("day-1"), [["20:30", "21:18"], ["20:00", "21:18"]]);
  replaceText(document.getElementById("day-11"), [["החזרת רכב וטיסה", "מהמלון ישר לשדה"]]);
  replaceText(document.body, [["האיסוף מתוכנן ל-20:30", "האיסוף בפועל היה ב-21:18"], ["האיסוף מתוכנן ל-20:00", "האיסוף בפועל היה ב-21:18"]]);

  const style = document.createElement("style");
  style.textContent = `
    .rental-latest {
      margin: 28px 0 34px;
      padding: clamp(22px, 4vw, 34px);
      border: 1px solid color-mix(in srgb, var(--trip-pine) 28%, var(--trip-line));
      border-radius: 18px;
      background: linear-gradient(145deg, var(--trip-paper-bright), color-mix(in srgb, var(--trip-sky) 46%, var(--trip-paper-bright)));
      box-shadow: 0 18px 44px rgba(35,42,73,.10);
    }
    .rental-latest__head { display:flex; flex-wrap:wrap; gap:12px; align-items:center; justify-content:space-between; margin-bottom:20px; }
    .rental-latest__head h3 { margin:0; color:var(--trip-navy); font-size:clamp(1.45rem,3vw,2rem); }
    .rental-latest__status { padding:6px 10px; border-radius:999px; background:#dff1ee; color:#246269; font-size:.76rem; font-weight:850; }
    .rental-latest__grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
    .rental-latest__item { padding:15px 16px; border-radius:14px; background:rgba(255,255,255,.62); }
    .rental-latest__item small { display:block; margin-bottom:4px; color:var(--trip-muted); font-weight:700; }
    .rental-latest__item strong { color:var(--trip-navy); }
    .rental-latest__item p { margin:4px 0 0; color:var(--trip-muted); font-size:.88rem; }
    .rental-latest__warn { margin-top:16px; padding:16px 18px; border-radius:14px; background:#fff0c6; color:#604b12; }
    .rental-latest__warn strong { display:block; margin-bottom:5px; }
    .rental-latest__foot { margin:14px 0 0; color:var(--trip-muted); font-size:.84rem; }
    .rental-prep-card { border-color:#e6b75e !important; background:linear-gradient(155deg,#fffaf5,#fff5d9) !important; }
    .rental-prep-card ul { margin:4px 0 0; padding-inline-start:20px; color:var(--trip-muted); }
    .rental-prep-card li + li { margin-top:6px; }
    @media (max-width:680px) { .rental-latest__grid { grid-template-columns:1fr; } }
  `;
  document.head.append(style);

  const bookings = document.getElementById("bookings");
  if (bookings && !bookings.querySelector(".rental-latest")) {
    const card = document.createElement("section");
    card.className = "rental-latest";
    card.setAttribute("aria-label", "פרטי הרכב השכור המעודכנים");
    card.innerHTML = `
      <div class="rental-latest__head">
        <h3>הרכב השכור — ההזמנה המעודכנת</h3>
        <span class="rental-latest__status">מאושר ב-SIXT</span>
      </div>
      <div class="rental-latest__grid">
        <div class="rental-latest__item"><small>איסוף</small><strong>22.09 · 21:18 · Zurich Airport</strong><p>שעת האיסוף בפועל לפי Rental Agreement</p></div>
        <div class="rental-latest__item"><small>החזרה</small><strong>01.10 · 21:18 · Zurich Airport</strong><p>Parking 3, קומה 2 · עודכן ב-Rental Agreement</p></div>
        <div class="rental-latest__item"><small>קטגוריה</small><strong>Premium Elite SUV</strong><p>BMW X3, Mercedes-Benz GLC או רכב דומה · אוטומטי</p></div>
        <div class="rental-latest__item"><small>כיסוי</small><strong>All Inclusive Protection · ללא השתתפות עצמית</strong><p>כולל סיוע 24/7, ביטוח צד ג', קילומטרים ללא הגבלה ו-Apple CarPlay / Android Auto</p></div>
        <div class="rental-latest__item"><small>מחיר כולל</small><strong>CHF 2’001.71</strong><p>לפי Rental Agreement המעודכן מ־24.09</p></div>
        <div class="rental-latest__item"><small>פיקדון</small><strong>CHF 512.39</strong><p>חסימה זמנית בכרטיס, משתחררת לאחר החזרת הרכב</p></div>
      </div>
      <div class="rental-latest__warn">
        <strong>העדכון החשוב להמשך הטיול</strong>
        לפי Rental Agreement המעודכן מ־24.09, <b>החזרת הרכב היא ב־1 באוקטובר בשעה 21:18</b> ב-Zurich Airport, Parking 3, קומה 2. לכן אין יותר החזרת רכב בבוקר הטיסה.
      </div>
      <p class="rental-latest__foot">מדיניות דלק: להחזיר באותה רמת דלק שבה התקבל הרכב, אלא אם מוסיפים תדלוק מראש. ההזמנה הקודמת בוטלה ללא חיוב.</p>`;

    const heading = bookings.querySelector(".section-heading");
    if (heading) heading.insertAdjacentElement("afterend", card);
    else bookings.prepend(card);
  }

  const preparation = document.getElementById("preparation");
  const prepGrid = preparation?.querySelector(".prep-grid");
  if (prepGrid && !prepGrid.querySelector(".rental-prep-card")) {
    const prep = document.createElement("article");
    prep.className = "prep-card prep-card--priority rental-prep-card";
    prep.innerHTML = `
      <span class="prep-status prep-status--now">מעודכן ל־1/10</span>
      <h3>החזרת SIXT בערב האחרון</h3>
      <p>ה-Rental Agreement האחרון משנה את לוח הזמנים:</p>
      <ul>
        <li><b>Return</b> — 1/10 בשעה 21:18.</li>
        <li><b>Location</b> — Zurich Airport, Parking 3, קומה 2.</li>
        <li><b>Fuel</b> — להחזיר באותה רמת דלק שבה התקבל הרכב, אלא אם נרכש תדלוק מראש.</li>
      </ul>`;
    prepGrid.prepend(prep);
  }

  const loadMapOptions = () => {
    if (document.querySelector('script[data-zurich-map-options]')) return;
    const mapOptionsScript = document.createElement("script");
    mapOptionsScript.src = "../../assets/zurich-map-options.js?v=20260929-1";
    mapOptionsScript.dataset.zurichMapOptions = "true";
    document.head.append(mapOptionsScript);
  };

  if (!document.querySelector('script[data-zurich-offenburg-stay]')) {
    const offenburgScript = document.createElement("script");
    offenburgScript.src = "../../assets/zurich-offenburg-stay.js?v=20260921-2";
    offenburgScript.dataset.zurichOffenburgStay = "true";
    offenburgScript.addEventListener("load", loadMapOptions, { once: true });
    offenburgScript.addEventListener("error", loadMapOptions, { once: true });
    document.head.append(offenburgScript);
  } else {
    loadMapOptions();
  }
})();