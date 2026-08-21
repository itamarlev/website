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
  replaceText(document.getElementById("day-1"), [["20:30", "20:00"]]);
  replaceText(document.getElementById("day-11"), [["12:00", "08:00"]]);
  replaceText(document.body, [["האיסוף מתוכנן ל-20:30", "האיסוף מתוכנן ל-20:00"]]);

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
        <div class="rental-latest__item"><small>איסוף</small><strong>22.09 · 20:00 · Zurich Airport</strong><p>Car Rental Center, קומה 1</p></div>
        <div class="rental-latest__item"><small>החזרה</small><strong>02.10 · 08:00 · Zurich Airport</strong><p>Parking 3, קומה 2</p></div>
        <div class="rental-latest__item"><small>קטגוריה</small><strong>Premium Elite SUV</strong><p>BMW X3, Mercedes-Benz GLC או רכב דומה · אוטומטי</p></div>
        <div class="rental-latest__item"><small>כיסוי</small><strong>All Inclusive Protection · ללא השתתפות עצמית</strong><p>כולל סיוע 24/7, ביטוח צד ג', קילומטרים ללא הגבלה ו-Apple CarPlay / Android Auto</p></div>
        <div class="rental-latest__item"><small>מחיר כולל</small><strong>CHF 1’310.99</strong><p>ייתכן שינוי רק אם יתווספו תוספות באיסוף</p></div>
        <div class="rental-latest__item"><small>פיקדון</small><strong>CHF 500</strong><p>חסימה זמנית בכרטיס, מוחזרת לאחר החזרת הרכב</p></div>
      </div>
      <div class="rental-latest__warn">
        <strong>⚠️ שני דברים שחייבים לוודא לפני הנסיעה</strong>
        אישור ההזמנה החדש מציג <b>נסיעה מחוץ לשווייץ</b> ו-<b>נהג נוסף</b> כתוספות שניתן להוסיף — לא כפריטים שכבר כלולים. מכיוון שהמסלול עובר לגרמניה ולצרפת והנהיגה מתחלקת, צריך לוודא ששניהם מתווספים להזמנה לפני האיסוף.
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
      <span class="prep-status prep-status--now">לטיפול עכשיו</span>
      <h3>עדכון SIXT לפני הנסיעה</h3>
      <p>ההזמנה החדשה מאושרת, אבל האישור מציע שני פריטים כתוספות שצריך לבדוק:</p>
      <ul>
        <li><b>Cross-border driving</b> — חובה למסלול לגרמניה ולצרפת כדי לשמור על הכיסוי.</li>
        <li><b>Additional driver</b> — כל מי שינהג צריך להיות רשום ולהגיע לאיסוף עם רישיון פיזי ותעודה מזהה.</li>
      </ul>`;
    prepGrid.prepend(prep);
  }
})();
