document.documentElement.classList.add("js");

(() => {
  const dayChapters = [...document.querySelectorAll("[data-day]")];
  const dayLinks = [...document.querySelectorAll("[data-day-link]")];
  const progressBar = document.querySelector(".day-nav__progress span");
  const dayTrack = document.querySelector(".day-nav__track");
  const backToTop = document.querySelector(".back-to-top");
  const expandAllButton = document.querySelector("[data-expand-all]");
  const pointGroups = [...document.querySelectorAll(".day-points")];
  const lightbox = document.querySelector(".image-lightbox");
  const lightboxImage = lightbox?.querySelector("img");
  const lightboxCaption = lightbox?.querySelector("p");
  let activeDay = 1;

  const setActiveDay = (day) => {
    if (day === activeDay && dayLinks.some((link) => link.hasAttribute("aria-current"))) return;
    activeDay = day;
    dayLinks.forEach((link) => {
      const isActive = Number(link.dataset.dayLink) === day;
      if (isActive) {
        link.setAttribute("aria-current", "step");
      } else {
        link.removeAttribute("aria-current");
      }
    });
    if (progressBar) progressBar.style.transform = `scaleX(${day / dayChapters.length})`;
  };

  if ("IntersectionObserver" in window) {
    const dayObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveDay(Number(visible.target.dataset.day));
    }, { rootMargin: "-28% 0px -52% 0px", threshold: [0, .2, .5] });

    dayChapters.forEach((chapter) => dayObserver.observe(chapter));

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });

    document.querySelectorAll(".trip-reveal").forEach((element) => revealObserver.observe(element));
  } else {
    document.querySelectorAll(".trip-reveal").forEach((element) => element.classList.add("is-revealed"));
  }

  setActiveDay(1);

  window.addEventListener("scroll", () => {
    backToTop?.classList.toggle("is-visible", window.scrollY > 720);
  }, { passive: true });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  dayTrack?.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    dayTrack.scrollLeft += event.deltaY;
  }, { passive: true });

  expandAllButton?.addEventListener("click", () => {
    const shouldOpen = expandAllButton.getAttribute("aria-expanded") !== "true";
    pointGroups.forEach((details) => { details.open = shouldOpen; });
    expandAllButton.setAttribute("aria-expanded", String(shouldOpen));
    expandAllButton.textContent = shouldOpen ? "הסתירו את כל נקודות המפה" : "הציגו את כל נקודות המפה";
  });

  document.querySelectorAll(".zoom-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      if (!lightbox || !lightboxImage || !lightboxCaption) return;
      lightboxImage.src = trigger.dataset.lightboxSrc || "";
      lightboxImage.alt = trigger.dataset.lightboxAlt || "";
      lightboxCaption.textContent = trigger.dataset.lightboxAlt || "";
      lightbox.showModal();
    });
  });

  lightbox?.querySelector(".lightbox-close")?.addEventListener("click", () => lightbox.close());
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  const isZurichTrip = window.location.pathname.includes("/trips/zurich-black-forest-alsace-2026/");

  if (isZurichTrip) {
    document.documentElement.style.scrollPaddingTop = "142px";

    const style = document.createElement("style");
    style.textContent = `
      .day-nav__sections {
        direction: rtl;
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding: 8px max(16px, calc((100vw - 1320px) / 2 + 16px));
        border-bottom: 1px solid rgba(255,255,255,.12);
        background: color-mix(in srgb, var(--trip-navy) 88%, #fff 12%);
        scrollbar-width: none;
      }
      .day-nav__sections::-webkit-scrollbar { display: none; }
      .day-nav .day-nav__sections a {
        flex: 0 0 auto;
        min-width: auto;
        padding: 7px 12px;
        border: 1px solid rgba(255,255,255,.18);
        border-radius: 999px;
        background: rgba(255,255,255,.055);
        color: rgba(255,255,255,.86);
        font-size: .76rem;
        font-weight: 800;
        text-decoration: none;
        white-space: nowrap;
      }
      .day-nav .day-nav__sections a:hover {
        border-color: rgba(255,255,255,.36);
        background: rgba(255,255,255,.12);
        color: #fff;
      }
      .day-nav .day-nav__sections a::after { display: none; }
      .day-nav a.is-today {
        box-shadow: inset 0 0 0 1px var(--trip-sun);
      }
      .day-nav a.is-today b::after {
        content: " · היום";
        color: #fff;
        font-size: .68rem;
      }
      .day-body .stay-link {
        margin-top: 12px;
        margin-inline-start: 8px;
        border: 1px solid color-mix(in srgb, var(--trip-pine) 32%, var(--trip-line));
        background: var(--trip-sky);
        color: var(--trip-navy);
        box-shadow: none;
      }
      .day-body .stay-link:hover {
        background: color-mix(in srgb, var(--trip-sky) 78%, #fff 22%);
        color: var(--trip-navy);
      }
      #stay-zurich, #stay-offenburg, #stay-guemar { scroll-margin-top: 142px; }
      @media (max-width: 520px) {
        .day-body .stay-link { margin-inline-start: 0; }
      }
    `;
    document.head.append(style);

    const dayNav = document.querySelector(".day-nav");
    const navProgress = dayNav?.querySelector(".day-nav__progress");
    if (dayNav && !dayNav.querySelector(".day-nav__sections")) {
      const sectionBar = document.createElement("div");
      sectionBar.className = "day-nav__sections";
      sectionBar.setAttribute("aria-label", "ניווט למקטעי העמוד");
      const sections = [
        ["#route", "סקירת המסלול"],
        ["#bookings", "טיסות ולינות"],
        ["#preparation", "הכנות וצ'קליסט"],
        ["#strategy", "איך מטיילים יחד"],
        ["#trip-map", "מפות"],
        ["#itinerary", "תוכנית יומית"]
      ];
      sectionBar.innerHTML = sections
        .map(([href, label]) => `<a href="${href}">${label}</a>`)
        .join("");
      navProgress?.insertAdjacentElement("afterend", sectionBar);
    }

    const hotelCards = [...document.querySelectorAll("#bookings .hotel-booking")];
    const findStayCard = (text) => hotelCards.find((card) => card.querySelector("h4")?.textContent.includes(text));
    const zurichStay = findStayCard("Hilton Garden Inn Zurich Limmattal");
    const offenburgStay = findStayCard("שתי דירות Airbnb");
    const guemarStay = findStayCard("בית Airbnb");
    if (zurichStay) zurichStay.id = "stay-zurich";
    if (offenburgStay) offenburgStay.id = "stay-offenburg";
    if (guemarStay) guemarStay.id = "stay-guemar";

    const stayByDay = {
      1: ["stay-zurich", "Hilton Zurich Limmattal"],
      2: ["stay-offenburg", "Offenburg"],
      3: ["stay-offenburg", "Offenburg"],
      4: ["stay-offenburg", "Offenburg"],
      5: ["stay-offenburg", "Offenburg"],
      6: ["stay-offenburg", "Offenburg"],
      7: ["stay-guemar", "Guémar"],
      8: ["stay-guemar", "Guémar"],
      9: ["stay-guemar", "Guémar"],
      10: ["stay-zurich", "Hilton Zurich Limmattal"],
      11: ["stay-zurich", "Hilton Zurich Limmattal"]
    };

    dayChapters.forEach((chapter) => {
      const day = Number(chapter.dataset.day);
      const stay = stayByDay[day];
      const dayBody = chapter.querySelector(".day-body");
      if (!stay || !dayBody || dayBody.querySelector(".stay-link")) return;
      const [targetId, label] = stay;
      if (!document.getElementById(targetId)) return;
      const link = document.createElement("a");
      link.className = "route-button stay-link";
      link.href = `#${targetId}`;
      link.innerHTML = `<svg aria-hidden="true"><use href="#icon-bed"/></svg>פרטי הלינה: ${label}<svg aria-hidden="true"><use href="#icon-arrow"/></svg>`;
      dayBody.append(link);
    });

    const tripDates = {
      "2026-09-22": 1,
      "2026-09-23": 2,
      "2026-09-24": 3,
      "2026-09-25": 4,
      "2026-09-26": 5,
      "2026-09-27": 6,
      "2026-09-28": 7,
      "2026-09-29": 8,
      "2026-09-30": 9,
      "2026-10-01": 10,
      "2026-10-02": 11
    };

    const dateInZurich = () => {
      try {
        const parts = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Europe/Zurich",
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        }).formatToParts(new Date());
        const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
        return `${values.year}-${values.month}-${values.day}`;
      } catch (_) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
    };

    const todayDay = tripDates[dateInZurich()];
    if (todayDay) {
      document.querySelector(`[data-day-link="${todayDay}"]`)?.classList.add("is-today");
      document.getElementById(`day-${todayDay}`)?.classList.add("is-today");
    }

    window.addEventListener("load", () => {
      if (!todayDay || window.location.hash) return;
      const target = document.getElementById(`day-${todayDay}`);
      if (!target) return;
      history.replaceState(null, "", `#day-${todayDay}`);
      requestAnimationFrame(() => {
        target.scrollIntoView({ block: "start", behavior: "auto" });
        setActiveDay(todayDay);
      });
    }, { once: true });
  }
})();
