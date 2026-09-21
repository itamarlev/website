(() => {
  if (!window.location.pathname.includes("/trips/zurich-black-forest-alsace-2026/")) return;

  const address = "Talweg 76, 77654 Offenburg, Germany";
  const stayCard = document.getElementById("stay-offenburg")
    || [...document.querySelectorAll("#bookings .hotel-booking")]
      .find((card) => card.querySelector("h4")?.textContent.includes("שתי דירות Airbnb"));

  const style = document.createElement("style");
  style.textContent = `
    .offenburg-confirmation {
      grid-column: 1 / -1;
      margin-top: 16px;
      padding: 18px;
      border: 1px solid color-mix(in srgb, var(--trip-pine) 24%, var(--trip-line));
      border-radius: 16px;
      background: color-mix(in srgb, var(--trip-sky) 38%, var(--trip-paper-bright));
    }
    .offenburg-confirmation__head {
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-bottom: 14px;
    }
    .offenburg-confirmation__head h5 {
      margin: 0;
      color: var(--trip-navy);
      font-size: 1rem;
    }
    .offenburg-confirmation__badge {
      padding: 5px 9px;
      border-radius: 999px;
      background: #dff1ee;
      color: #246269;
      font-size: .7rem;
      font-weight: 850;
    }
    .offenburg-confirmation__grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }
    .offenburg-confirmation__item {
      padding: 11px 12px;
      border-radius: 12px;
      background: rgba(255,255,255,.62);
    }
    .offenburg-confirmation__item small {
      display: block;
      margin-bottom: 3px;
      color: var(--trip-muted);
      font-weight: 750;
    }
    .offenburg-confirmation__item strong {
      color: var(--trip-navy);
      font-size: .88rem;
    }
    .offenburg-confirmation__item p {
      margin: 3px 0 0;
      color: var(--trip-muted);
      font-size: .78rem;
      line-height: 1.45;
    }
    .offenburg-confirmation__private {
      margin: 12px 0 0;
      padding-top: 11px;
      border-top: 1px solid color-mix(in srgb, var(--trip-line) 75%, transparent);
      color: var(--trip-muted);
      font-size: .76rem;
      line-height: 1.5;
    }
    .offenburg-day-note {
      margin-bottom: 20px;
    }
    @media (max-width: 620px) {
      .offenburg-confirmation__grid { grid-template-columns: 1fr; }
    }
  `;
  document.head.append(style);

  if (stayCard && !stayCard.querySelector(".offenburg-confirmation")) {
    const panel = document.createElement("section");
    panel.className = "offenburg-confirmation";
    panel.setAttribute("aria-label", "פרטי הגעה מעודכנים לדירה הגדולה ב-Offenburg");
    panel.innerHTML = `
      <div class="offenburg-confirmation__head">
        <h5>הדירה הגדולה — LUMIFLATS Offenburg</h5>
        <span class="offenburg-confirmation__badge">אישור מארחים · 7 אורחים</span>
      </div>
      <div class="offenburg-confirmation__grid">
        <div class="offenburg-confirmation__item">
          <small>כתובת</small>
          <strong dir="ltr">Talweg 76, 77654 Offenburg</strong>
          <p>הכתובת אומתה גם מול רישום LUMIFLATS ברשת.</p>
        </div>
        <div class="offenburg-confirmation__item">
          <small>צ'ק-אין</small>
          <strong>23.09 · החל מ-16:00</strong>
          <p>הגעה מוקדמת רק בתיאום מראש. המארחים ביקשו לעדכן את שעת ההגעה מוקדם ככל האפשר.</p>
        </div>
        <div class="offenburg-confirmation__item">
          <small>חניה</small>
          <strong>2 מקומות חניה המסומנים 3</strong>
          <p>אפשרות נוספת: חניה ברחוב לאורך הנחל.</p>
        </div>
        <div class="offenburg-confirmation__item">
          <small>רכב חשמלי</small>
          <strong>עמדת טעינה זמינה בתיאום</strong>
          <p>יש לפנות למארחים אם רוצים להשתמש בעמדת הטעינה.</p>
        </div>
      </div>
      <p class="offenburg-confirmation__private"><b>פרטי כניסה פרטיים:</b> קוד הדלת, סיסמת ה-Wi-Fi, מספר הטלפון של המארחים והוראות הכניסה המדויקות נשארים מחוץ לאתר הציבורי. פרטי ה-Wi-Fi נמצאים בקבוצה "היער השחור 2026" בוואטסאפ. כדאי לשמור את מייל האישור זמין בטלפון.</p>
    `;
    stayCard.append(panel);

    const genericMap = stayCard.querySelector(".hotel-links a[href*='google.com/maps']");
    if (genericMap) {
      genericMap.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      genericMap.lastChild && genericMap.lastChild.nodeType === Node.TEXT_NODE
        ? genericMap.lastChild.nodeValue = "LUMIFLATS"
        : null;
      genericMap.setAttribute("aria-label", "פתחו את LUMIFLATS Offenburg ב-Google Maps");
    }
  }

  const day2 = document.getElementById("day-2");
  const day2Body = day2?.querySelector(".day-body");
  if (day2Body && !day2Body.querySelector(".offenburg-day-note")) {
    const note = document.createElement("div");
    note.className = "important-note offenburg-day-note";
    note.innerHTML = `
      <svg aria-hidden="true"><use href="#icon-bed"/></svg>
      <div>
        <b>צ'ק-אין ב-Offenburg · החל מ-16:00</b>
        <span>היעד הוא Talweg 76. חשוב לעדכן את Kerstin & Jan בשעת ההגעה המתוכננת מוקדם ככל האפשר. מוקדם מ-16:00 רק בתיאום.</span>
      </div>
    `;
    const meta = day2Body.querySelector(".day-meta");
    if (meta) meta.insertAdjacentElement("beforebegin", note);
    else day2Body.append(note);
  }

  const prepGrid = document.querySelector("#preparation .prep-grid");
  if (prepGrid && !prepGrid.querySelector(".offenburg-arrival-prep")) {
    const prep = document.createElement("article");
    prep.className = "prep-card prep-card--priority offenburg-arrival-prep";
    prep.innerHTML = `
      <span class="prep-status prep-status--now">לפני 23/9</span>
      <h3>לעדכן שעת הגעה ל-Offenburg</h3>
      <p>המארחים ביקשו לקבל מוקדם ככל האפשר את שעת ההגעה המשוערת. צ'ק-אין רגיל החל מ-16:00; הגעה מוקדמת דורשת תיאום.</p>
    `;
    prepGrid.prepend(prep);
  }
})();