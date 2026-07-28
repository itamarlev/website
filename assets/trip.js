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
        link.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
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
})();
