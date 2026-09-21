(() => {
  "use strict";

  const days = [
    { day: 1, date: "2026-09-22", place: "ציריך", lat: 47.3769, lon: 8.5417, high: 21, low: 10, code: 0, rain: 0, pack: "שכבה ארוכה לערב הנחיתה; במהלך היום חולצה קצרה מספיקה." },
    { day: 2, date: "2026-09-23", place: "Freiburg", lat: 47.999, lon: 7.8421, high: 22, low: 7, code: 3, rain: 8, pack: "פליז לבוקר ולערב, חולצה קצרה להליכה בעיר." },
    { day: 3, date: "2026-09-24", place: "Triberg", lat: 48.131, lon: 8.231, high: 16, low: 7, code: 3, rain: 21, pack: "היום הקריר בטיול: פליז, מעיל קל ונעליים סגורות עם אחיזה." },
    { day: 4, date: "2026-09-25", place: "Rust / Baden-Baden", lat: 48.266, lon: 7.722, high: 24, low: 5, code: 1, rain: 3, pack: "בוקר קר מאוד, צהריים נעימים: להגיע בשכבות ולהשאיר פליז ברכב." },
    { day: 5, date: "2026-09-26", place: "Strasbourg", lat: 48.5734, lon: 7.7521, high: 25, low: 7, code: 3, rain: 0, pack: "שכבה קלה לבוקר; כובע ובקבוק מים לשיטוט בצהריים." },
    { day: 6, date: "2026-09-27", place: "Mehliskopf", lat: 48.6486, lon: 8.2368, high: 20, low: 8, code: 61, rain: 7, pack: "פליז ומעיל גשם דק, מכנס נוח ונעליים סגורות לפארק החבלים." },
    { day: 7, date: "2026-09-28", place: "Guémar / כפרי היין", lat: 48.1888, lon: 7.3964, high: 29, low: 14, code: 3, rain: 6, pack: "יום חם: בגדים קלים, כובע וקרם הגנה; שכבה דקה לערב." },
    { day: 8, date: "2026-09-29", place: "Kintzheim", lat: 48.254, lon: 7.373, high: 27, low: 15, code: 2, rain: 6, pack: "בגדים קלים ונעלי הליכה; שכבה דקה לטירה ולרוח בגובה." },
    { day: 9, date: "2026-09-30", place: "Colmar", lat: 48.0794, lon: 7.3585, high: 27, low: 16, code: 1, rain: 4, pack: "קיצי בצהריים: חולצה קצרה, כובע ונעליים נוחות לעיר העתיקה." },
    { day: 10, date: "2026-10-01", place: "ציריך", lat: 47.3769, lon: 8.5417, high: 27, low: 13, code: 3, rain: 8, pack: "בגדים קלים לצהריים ושכבה ארוכה לטיול ערב ליד האגם." },
    { day: 11, date: "2026-10-02", place: "Zurich Airport", lat: 47.3769, lon: 8.5417, high: 24, low: 12, code: 0, rain: 19, pack: "לבוש נוח לטיסה ושכבה קלה ליציאה המוקדמת מהמלון." },
  ];

  const weatherLabel = (code) => {
    if (code === 0) return "שמשי";
    if (code === 1) return "בהיר ברובו";
    if (code === 2) return "מעונן חלקית";
    if (code === 3) return "מעונן";
    if (code === 45 || code === 48) return "ערפילי";
    if (code >= 51 && code <= 57) return "טפטוף אפשרי";
    if (code >= 61 && code <= 67) return "גשם קל אפשרי";
    if (code >= 71 && code <= 77) return "שלג אפשרי";
    if (code >= 80 && code <= 82) return "ממטרים אפשריים";
    if (code >= 95) return "סופות רעמים אפשריות";
    return "מזג אוויר משתנה";
  };

  const renderDay = (forecast) => {
    const card = document.querySelector(`#day-${forecast.day}`);
    const anchor = card?.querySelector(".day-badges");
    if (!card || !anchor) return;

    let weather = card.querySelector(".day-weather");
    if (!weather) {
      weather = document.createElement("section");
      weather.className = "day-weather";
      anchor.insertAdjacentElement("afterend", weather);
    }

    const high = Math.round(forecast.high);
    const low = Math.round(forecast.low);
    const rain = Number.isFinite(forecast.rain) ? Math.round(forecast.rain) : 0;
    const condition = weatherLabel(forecast.code);
    weather.setAttribute("aria-label", `תחזית מזג האוויר ל-${forecast.place}: ${condition}, ${low} עד ${high} מעלות`);
    weather.innerHTML = `
      <div class="day-weather__primary">
        <div class="day-weather__place">
          <strong>${forecast.place}</strong>
          <span>${condition}</span>
        </div>
        <span class="day-weather__temperature" dir="ltr">${high}° / ${low}°</span>
      </div>
      <div class="day-weather__details">
        <span>מקסימום ${high}°</span>
        <span>מינימום ${low}°</span>
        <span>סיכוי לגשם ${rain}%</span>
      </div>
      <p class="day-weather__packing"><strong>מה ללבוש:</strong> ${forecast.pack}</p>
    `;
  };

  days.forEach(renderDay);

  const refreshForecast = async () => {
    const endpoint = new URL("https://api.open-meteo.com/v1/forecast");
    endpoint.searchParams.set("latitude", days.map((day) => day.lat).join(","));
    endpoint.searchParams.set("longitude", days.map((day) => day.lon).join(","));
    endpoint.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max");
    endpoint.searchParams.set("timezone", "Europe/Berlin");
    endpoint.searchParams.set("start_date", days[0].date);
    endpoint.searchParams.set("end_date", days.at(-1).date);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 7000);
    try {
      const response = await fetch(endpoint, { cache: "no-store", signal: controller.signal });
      if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);
      const payload = await response.json();
      const locations = Array.isArray(payload) ? payload : [payload];

      days.forEach((fallback, index) => {
        const daily = locations[index]?.daily;
        const dateIndex = daily?.time?.indexOf(fallback.date) ?? -1;
        if (dateIndex < 0) return;
        renderDay({
          ...fallback,
          high: daily.temperature_2m_max?.[dateIndex] ?? fallback.high,
          low: daily.temperature_2m_min?.[dateIndex] ?? fallback.low,
          code: daily.weather_code?.[dateIndex] ?? fallback.code,
          rain: daily.precipitation_probability_max?.[dateIndex] ?? fallback.rain,
        });
      });

      const status = document.querySelector("[data-weather-status]");
      if (status) status.textContent = "התחזית עודכנה אוטומטית כעת. מומלץ לבדוק שוב ערב לפני כל יום.";
    } catch (_) {
      const status = document.querySelector("[data-weather-status]");
      if (status) status.textContent = "מוצגת התחזית שנבדקה ב־21.09.2026. מומלץ לבדוק שוב ערב לפני כל יום.";
    } finally {
      window.clearTimeout(timeout);
    }
  };

  refreshForecast();
})();
