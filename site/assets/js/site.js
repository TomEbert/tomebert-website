const translations = Array.from(document.querySelectorAll('[data-en], [data-en-label], [data-en-alt]'), element => {
  const attribute = element.hasAttribute('data-en-alt') ? 'alt' : element.hasAttribute('data-en-label') ? 'aria-label' : null;
  return {
    element,
    attribute,
    de: attribute ? element.getAttribute(attribute) : element.textContent,
    en: element.dataset.enAlt ?? element.dataset.enLabel ?? element.dataset.en
  };
});

const emailLink = document.querySelector('.email-link');
const emailUser = [104, 101, 108, 108, 111].map(code => String.fromCharCode(code)).join('');
const emailDomain = [116, 111, 109, 101, 98, 101, 114, 116, 46, 100, 101].map(code => String.fromCharCode(code)).join('');
const emailAddress = emailUser + '@' + emailDomain;
emailLink.href = 'mailto:' + emailAddress;
emailLink.textContent = emailAddress;
emailLink.setAttribute('aria-label', emailAddress);
const themeToggle = document.querySelector('.theme-toggle');
const deviceTheme = window.matchMedia('(prefers-color-scheme: dark)');
const root = document.documentElement;

function updateThemeButton() {
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : deviceTheme.matches;
  themeToggle.setAttribute('aria-pressed', String(dark));
}

themeToggle.addEventListener('click', () => {
  root.dataset.theme = themeToggle.getAttribute('aria-pressed') === 'true' ? 'light' : 'dark';
  updateThemeButton();
});
deviceTheme.addEventListener('change', updateThemeButton);
updateThemeButton();
themeToggle.hidden = false;

const motionToggle = document.querySelector(".motion-toggle");
motionToggle.addEventListener("click", () => {
  const paused = root.toggleAttribute("data-motion-paused");
  motionToggle.setAttribute("aria-pressed", String(paused));
});
motionToggle.hidden = false;

const monitorPower = document.querySelector(".terminal-power");
const monitor = monitorPower.closest(".terminal-name");
monitorPower.addEventListener("click", () => {
  const off = monitor.toggleAttribute("data-monitor-off");
  monitorPower.setAttribute("aria-pressed", String(!off));
});
monitorPower.hidden = false;

const portraitButton = document.querySelector(".portrait-trigger");
const terminalSignal = document.querySelector(".terminal-signal");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let clearBurst;

portraitButton.addEventListener("click", (event) => {
  const bounds = portraitButton.getBoundingClientRect();
  const burst = document.createElement("span");
  burst.className = "portrait-burst";
  burst.setAttribute("aria-hidden", "true");

  // Keyboard activation starts at the center of the photo.
  const x = event.detail ? event.clientX - bounds.left : bounds.width / 2;
  const y = event.detail ? event.clientY - bounds.top : bounds.height / 2;
  burst.style.left = x + "px";
  burst.style.top = y + "px";

  if (!reducedMotion.matches && !root.hasAttribute("data-motion-paused")) {
    const reach = Math.hypot(bounds.width, bounds.height) * .48;
    burst.style.setProperty("--reach", reach + "px");
    for (let index = 0; index < 72; index++) {
      const spark = document.createElement("i");
      const angle = index * 137.5 + Math.random() * 12;
      spark.style.setProperty("--angle", angle + "deg");
      spark.style.setProperty("--distance", reach * (.15 + Math.random() * .85) + "px");
      spark.style.setProperty("--duration", 520 + Math.random() * 430 + "ms");
      spark.style.setProperty("--delay", index % 3 * 65 + "ms");
      burst.append(spark);
    }
  }

  portraitButton.replaceChildren(burst);
  terminalSignal.replaceChildren(document.createElement("span"));
  window.clearTimeout(clearBurst);
  clearBurst = window.setTimeout(() => {
    burst.remove();
    terminalSignal.replaceChildren();
  }, 1200);
});
portraitButton.hidden = false;

const buttons = Array.from(document.querySelectorAll('.language button'));

function setLanguage(language) {
  document.documentElement.lang = language;
  for (const { element, attribute, ...text } of translations) {
    if (attribute) element.setAttribute(attribute, text[language]);
    else element.textContent = text[language];
  }
  for (const button of buttons) {
    button.setAttribute('aria-pressed', String(button.lang === language));
  }
}

for (const button of buttons) {
  button.addEventListener('click', () => setLanguage(button.lang));
}
