const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('is-open', !isOpen);
});

const techIcons = [...document.querySelectorAll('.tech-icon')];
const techCounter = document.querySelector('.tech-counter');
let activeTech = 0;

setInterval(() => {
  if (!techIcons.length) return;
  techIcons[activeTech].classList.remove('is-active');
  activeTech = (activeTech + 1) % techIcons.length;
  techIcons[activeTech].classList.add('is-active');
  if (techCounter) techCounter.textContent = `${String(activeTech + 1).padStart(2, '0')} — ${String(techIcons.length).padStart(2, '0')}`;
}, 2400);

document.querySelector('.signup-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  button.innerHTML = 'Inscrito! <span>✓</span>';
  button.disabled = true;
});

const copyEmailButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-status');

copyEmailButton?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyEmailButton.dataset.email);
    copyStatus.textContent = 'E-mail copiado.';
  } catch {
    copyStatus.textContent = 'Não foi possível copiar. Use valentedev00@gmail.com.';
  }
});

const analyticsMeasurementId = 'G-BELMT0NW0V';
const consentStorageKey = 'jv-portfolio-analytics-consent';
const consentBanner = document.querySelector('[data-consent-banner]');

function loadAnalytics() {
  if (window.__analyticsLoaded) return;
  window.__analyticsLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', analyticsMeasurementId, { anonymize_ip: true });
  const analyticsScript = document.createElement('script');
  analyticsScript.async = true;
  analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsMeasurementId}`;
  document.head.append(analyticsScript);
}

function saveConsent(value) {
  localStorage.setItem(consentStorageKey, value);
  consentBanner?.setAttribute('hidden', '');
  if (value === 'accepted') loadAnalytics();
}

const storedConsent = localStorage.getItem(consentStorageKey);
if (storedConsent === 'accepted') loadAnalytics();
else if (!storedConsent) consentBanner?.removeAttribute('hidden');

document.querySelector('[data-consent-accept]')?.addEventListener('click', () => saveConsent('accepted'));
document.querySelector('[data-consent-deny]')?.addEventListener('click', () => saveConsent('essential'));

const portfolioVitals = { lcp: null, inp: null, cls: 0 };
window.__portfolioVitals = portfolioVitals;

if ('PerformanceObserver' in window) {
  const supportedEntries = PerformanceObserver.supportedEntryTypes || [];

  if (supportedEntries.includes('largest-contentful-paint')) {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      portfolioVitals.lcp = Math.round(entries[entries.length - 1].startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  }

  if (supportedEntries.includes('layout-shift')) {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) portfolioVitals.cls += entry.value;
      }
      portfolioVitals.cls = Number(portfolioVitals.cls.toFixed(3));
    }).observe({ type: 'layout-shift', buffered: true });
  }

  if (supportedEntries.includes('event')) {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.interactionId && (!portfolioVitals.inp || entry.duration > portfolioVitals.inp)) {
          portfolioVitals.inp = Math.round(entry.duration);
        }
      }
    }).observe({ type: 'event', buffered: true, durationThreshold: 40 });
  }
}
