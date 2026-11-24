const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const menuToggle = $("#menuToggle");
const primaryNav = $("#primaryNav");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const open = primaryNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });

  $$("a", primaryNav).forEach(link => {
    link.addEventListener("click", () => {
      primaryNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", event => {
    if (!primaryNav.contains(event.target) && !menuToggle.contains(event.target)) {
      primaryNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const roleTarget = $("#typedRole");
const roles = ["AI Engineer", "Python Developer", "ML Explorer", "Generative AI Builder"];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (roleTarget && !reducedMotion) {
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = false;
  roleTarget.textContent = roles[0];

  const type = () => {
    const current = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    roleTarget.textContent = current.slice(0, charIndex);

    let delay = deleting ? 42 : 82;
    if (!deleting && charIndex === current.length) {
      deleting = true;
      delay = 1450;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 300;
    }
    window.setTimeout(type, delay);
  };
  window.setTimeout(type, 1500);
}

const year = $("#year");
if (year) year.textContent = new Date().getFullYear();

const revealItems = $$(".reveal");
if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("is-visible"));
}

const sections = $$("main section[id]");
const navLinks = $$("#primaryNav a");
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach(section => sectionObserver.observe(section));
}

document.documentElement.classList.add("js-ready");
