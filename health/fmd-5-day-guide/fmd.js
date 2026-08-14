document.documentElement.classList.add('js');

const checks = [...document.querySelectorAll('.daycheck')];
const bar = document.getElementById('progressBar');
const text = document.getElementById('progressText');
const journeyBar = document.getElementById('journeyProgress');
const journeySteps = [...document.querySelectorAll('.journey-step')];
const celebration = document.getElementById('celebration');
const celebrationClose = document.getElementById('celebrationClose');
let celebrated = sessionStorage.getItem('fmd-celebrated') === '1';
let modalReturnFocus = null;

function updateProgress(announce = false) {
  const done = checks.filter((check) => check.checked).length;
  const percent = done / checks.length * 100;

  bar.style.width = `${percent}%`;
  bar.parentElement.setAttribute('aria-valuenow', String(done));
  text.textContent = `${done} מתוך ${checks.length}`;
  journeyBar.style.width = `${percent}%`;

  checks.forEach((check, index) => {
    localStorage.setItem(`fmd-day-${check.dataset.day}`, check.checked ? '1' : '0');
    journeySteps[index].classList.toggle('done', check.checked);
    journeySteps[index].querySelector('b').textContent = check.checked ? '✓' : String(index + 1);
    journeySteps[index].setAttribute('aria-label', check.checked ? `יום ${index + 1} הושלם` : `מעבר ליום ${index + 1}`);
  });

  const nextIndex = checks.findIndex((check) => !check.checked);
  journeySteps.forEach((step, index) => step.classList.toggle('current', index === nextIndex));

  if (done === checks.length && announce && !celebrated) {
    modalReturnFocus = document.activeElement;
    celebration.classList.add('show');
    celebration.setAttribute('aria-hidden', 'false');
    celebrationClose.focus();
    sessionStorage.setItem('fmd-celebrated', '1');
    celebrated = true;
  }
}

checks.forEach((check) => {
  check.checked = localStorage.getItem(`fmd-day-${check.dataset.day}`) === '1';
  check.addEventListener('change', () => updateProgress(true));
});

document.getElementById('resetBtn').addEventListener('click', () => {
  checks.forEach((check) => { check.checked = false; });
  sessionStorage.removeItem('fmd-celebrated');
  celebrated = false;
  updateProgress();
});

function closeCelebration() {
  celebration.classList.remove('show');
  celebration.setAttribute('aria-hidden', 'true');
  if (modalReturnFocus instanceof HTMLElement) modalReturnFocus.focus();
}

celebrationClose.addEventListener('click', closeCelebration);
celebration.addEventListener('click', (event) => {
  if (event.target === celebration) closeCelebration();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && celebration.classList.contains('show')) closeCelebration();
  if (event.key === 'Tab' && celebration.classList.contains('show')) {
    event.preventDefault();
    celebrationClose.focus();
  }
});

const revealTargets = document.querySelectorAll('section, .summary, .visual-story, .journey-map');
revealTargets.forEach((target) => target.classList.add('reveal'));

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .08, rootMargin: '0px 0px -30px' });
  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add('visible'));
}

const navLinks = [...document.querySelectorAll('nav a')];
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${visible.target.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, .2, .5] });
  observedSections.forEach((section) => sectionObserver.observe(section));
}

updateProgress();
