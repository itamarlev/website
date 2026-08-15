document.documentElement.classList.add('js');

const STORAGE_PREFIX = 'dash-guide-v1';
const checks = [...document.querySelectorAll('.daycheck')];
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const ribbon = document.getElementById('pressureRibbon');
const completion = document.getElementById('completion');
const completionClose = document.getElementById('completionClose');
let celebrated = sessionStorage.getItem(`${STORAGE_PREFIX}-celebrated`) === '1';

function buildRibbon() {
  const fragment = document.createDocumentFragment();
  checks.forEach((check, index) => {
    const link = document.createElement('a');
    link.className = 'ribbon-step';
    link.href = `#day${index + 1}`;
    link.innerHTML = `<b><span>${index + 1}</span></b><span>יום ${index + 1}</span>`;
    link.setAttribute('aria-label', `מעבר ליום ${index + 1}`);
    fragment.appendChild(link);
  });
  ribbon.appendChild(fragment);
}

buildRibbon();
const ribbonSteps = [...document.querySelectorAll('.ribbon-step')];

function updateProgress(announce = false) {
  const done = checks.filter((check) => check.checked).length;
  const percent = checks.length ? (done / checks.length) * 100 : 0;
  progressBar.style.transform = `scaleX(${percent / 100})`;
  progressBar.parentElement.setAttribute('aria-valuenow', String(done));
  progressText.textContent = `${done} מתוך ${checks.length}`;

  checks.forEach((check, index) => {
    localStorage.setItem(`${STORAGE_PREFIX}-day-${check.dataset.day}`, check.checked ? '1' : '0');
    document.querySelector(`[data-day-card="${check.dataset.day}"]`)?.classList.toggle('completed', check.checked);
    ribbonSteps[index]?.classList.toggle('done', check.checked);
    ribbonSteps[index]?.setAttribute('aria-label', check.checked ? `יום ${index + 1} הושלם` : `מעבר ליום ${index + 1}`);
  });

  const next = checks.findIndex((check) => !check.checked);
  ribbonSteps.forEach((step, index) => step.classList.toggle('current', index === next));

  if (done === checks.length && announce && !celebrated) {
    completion.classList.add('show');
    completion.setAttribute('aria-hidden', 'false');
    completionClose.focus();
    sessionStorage.setItem(`${STORAGE_PREFIX}-celebrated`, '1');
    celebrated = true;
  }
}

checks.forEach((check) => {
  check.checked = localStorage.getItem(`${STORAGE_PREFIX}-day-${check.dataset.day}`) === '1';
  check.addEventListener('change', () => updateProgress(true));
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (!window.confirm('לאפס את כל סימוני 14 הימים? מדידות לחץ הדם לא יימחקו.')) return;
  checks.forEach((check) => { check.checked = false; });
  sessionStorage.removeItem(`${STORAGE_PREFIX}-celebrated`);
  celebrated = false;
  updateProgress();
});

function closeCompletion() {
  completion.classList.remove('show');
  completion.setAttribute('aria-hidden', 'true');
  const afterSection = document.getElementById('after');
  afterSection.setAttribute('tabindex', '-1');
  afterSection.focus();
  afterSection.scrollIntoView();
}

completionClose.addEventListener('click', closeCompletion);
completion.addEventListener('click', (event) => {
  if (event.target === completion) closeCompletion();
});
document.addEventListener('keydown', (event) => {
  if (!completion.classList.contains('show')) return;
  if (event.key === 'Escape') closeCompletion();
  if (event.key === 'Tab') {
    event.preventDefault();
    completionClose.focus();
  }
});

const sodiumOptions = [...document.querySelectorAll('input[name="sodium"]')];
const sodiumAdvice = document.getElementById('sodiumAdvice');
function setSodiumTarget(value) {
  localStorage.setItem(`${STORAGE_PREFIX}-sodium`, value);
  sodiumAdvice.textContent = value === '1500'
    ? 'ב־1,500 מ״ג כמעט כל הבחירות המעובדות דורשות בדיקה. תכנן מראש לחם, רטבים, טופו, שימורים וארוחות בחוץ.'
    : 'התחל בקריאת תוויות ובהפחתת מזון מוכן. אין צורך להגיע ליעד ביום אחד.';
}
const savedSodium = localStorage.getItem(`${STORAGE_PREFIX}-sodium`) || '2300';
sodiumOptions.forEach((option) => {
  option.checked = option.value === savedSodium;
  option.addEventListener('change', () => setSodiumTarget(option.value));
});
setSodiumTarget(savedSodium);

const dietOptions = [...document.querySelectorAll('input[name="dietMode"]')];
const dietModeText = document.getElementById('dietModeText');
const copyDietLink = document.getElementById('copyDietLink');

function setDietMode(value, updateUrl = true) {
  const mode = value === 'standard' ? 'standard' : 'vegan';
  document.documentElement.classList.toggle('diet-standard', mode === 'standard');
  localStorage.setItem(`${STORAGE_PREFIX}-diet-mode`, mode);
  dietOptions.forEach((option) => { option.checked = option.value === mode; });
  dietModeText.textContent = mode === 'standard'
    ? 'מוצגת כרגע גרסת DASH הרגילה. התפריט נשאר עשיר במזון צמחי ומציג החלפות מן החי.'
    : 'מוצגת כרגע הגרסה הטבעונית.';

  if (updateUrl && window.history?.replaceState) {
    const url = new URL(window.location.href);
    if (mode === 'standard') url.searchParams.set('diet', 'standard');
    else url.searchParams.delete('diet');
    window.history.replaceState({}, '', url);
  }
}

const requestedDiet = new URLSearchParams(window.location.search).get('diet');
const savedDiet = localStorage.getItem(`${STORAGE_PREFIX}-diet-mode`) || 'vegan';
const initialDiet = requestedDiet === 'standard' ? 'standard' : requestedDiet === 'vegan' ? 'vegan' : savedDiet;
setDietMode(initialDiet);
dietOptions.forEach((option) => option.addEventListener('change', () => setDietMode(option.value)));

copyDietLink.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copyDietLink.textContent = 'הקישור הועתק';
  } catch {
    copyDietLink.textContent = 'העתק את הכתובת משורת הדפדפן';
  }
  window.setTimeout(() => { copyDietLink.textContent = 'העתקת קישור לגרסה המוצגת'; }, 3000);
});

const bpForm = document.getElementById('bpForm');
const bpRows = document.getElementById('bpRows');
const bpAverage = document.getElementById('bpAverage');
const bpCount = document.getElementById('bpCount');
const bpError = document.getElementById('bpError');
const bpDate = document.getElementById('bpDate');
bpDate.valueAsDate = new Date();

function readMeasurements() {
  try { return JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}-bp`) || '[]'); }
  catch { return []; }
}

function saveMeasurements(items) {
  localStorage.setItem(`${STORAGE_PREFIX}-bp`, JSON.stringify(items));
}

function renderMeasurements() {
  const items = readMeasurements();
  bpRows.replaceChildren();
  if (!items.length) {
    const row = document.createElement('tr');
    row.className = 'empty-row';
    row.innerHTML = '<td colspan="4">המדידה הראשונה תופיע כאן.</td>';
    bpRows.appendChild(row);
    bpAverage.textContent = '— / —';
    bpCount.textContent = 'אין עדיין מדידות';
    return;
  }

  items.slice().reverse().forEach((item) => {
    const row = document.createElement('tr');
    const [year, month, day] = item.date.split('-');
    row.innerHTML = `<td>${day}.${month}.${year}</td><td>${item.period}</td><td>${item.systolic} / ${item.diastolic}</td><td><button class="delete-reading" type="button" data-reading-id="${item.id}" aria-label="מחיקת מדידה מ־${day}.${month}.${year}">מחיקה</button></td>`;
    bpRows.appendChild(row);
  });

  const systolic = Math.round(items.reduce((sum, item) => sum + item.systolic, 0) / items.length);
  const diastolic = Math.round(items.reduce((sum, item) => sum + item.diastolic, 0) / items.length);
  bpAverage.textContent = `${systolic} / ${diastolic}`;
  bpCount.textContent = `${items.length} מדידות שמורות`;
}

bpForm.addEventListener('submit', (event) => {
  event.preventDefault();
  bpError.textContent = '';
  const data = new FormData(bpForm);
  const systolic = Number(data.get('systolic'));
  const diastolic = Number(data.get('diastolic'));
  if (systolic <= diastolic) {
    bpError.textContent = 'המספר הסיסטולי צריך להיות גבוה מהמספר הדיאסטולי.';
    document.getElementById('bpSystolic').focus();
    return;
  }
  const items = readMeasurements();
  items.push({ id: `${Date.now()}`, date: String(data.get('date')), period: String(data.get('period')), systolic, diastolic });
  saveMeasurements(items);
  bpForm.reset();
  bpDate.valueAsDate = new Date();
  renderMeasurements();
});

bpRows.addEventListener('click', (event) => {
  const button = event.target.closest('[data-reading-id]');
  if (!button) return;
  if (!window.confirm('למחוק את המדידה הזאת?')) return;
  const items = readMeasurements().filter((item) => item.id !== button.dataset.readingId);
  saveMeasurements(items);
  renderMeasurements();
});

const revealTargets = [...document.querySelectorAll('.reveal')];
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .06, rootMargin: '0px 0px -30px' });
  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add('visible'));
}

const navLinks = [...document.querySelectorAll('.nav-inner a')];
const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${visible.target.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-20% 0px -68% 0px', threshold: [0, .15, .4] });
  sections.forEach((section) => sectionObserver.observe(section));
}

updateProgress();
renderMeasurements();
