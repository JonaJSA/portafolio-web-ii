const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const savedTheme = localStorage.getItem("portfolio-theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeButton.setAttribute("aria-label", theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
  themeMeta.setAttribute("content", theme === "dark" ? "#08111f" : "#f5f8fb");
}

applyTheme(savedTheme || systemTheme);

themeButton.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem("portfolio-theme", nextTheme);
});

menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.querySelector(".sr-only").textContent = isOpen ? "Cerrar menú" : "Abrir menú";
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

const roles = ["HTML semántico", "diseño responsivo", "JavaScript", "accesibilidad web"];
const roleElement = document.querySelector("#typed-role");
let roleIndex = 0;
let letterIndex = roles[0].length;
let deleting = true;

function typeRole() {
  if (prefersReducedMotion.matches) return;

  const word = roles[roleIndex];
  letterIndex += deleting ? -1 : 1;
  roleElement.textContent = word.slice(0, letterIndex);

  let delay = deleting ? 45 : 85;
  if (letterIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 350;
  } else if (letterIndex === word.length) {
    deleting = true;
    delay = 1500;
  }
  window.setTimeout(typeRole, delay);
}

window.setTimeout(typeRole, 1200);

const revealElements = document.querySelectorAll(".reveal");
if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  revealElements.forEach((element) => revealObserver.observe(element));
}

const filters = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project-card");
const emptyMessage = document.querySelector(".empty-projects");

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;
    let visibleCount = 0;

    filters.forEach((filter) => {
      const isActive = filter === button;
      filter.classList.toggle("active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });

    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const show = selected === "all" || categories.includes(selected);
      card.hidden = !show;
      if (show) visibleCount += 1;
    });

    emptyMessage.hidden = visibleCount !== 0;
  });
});

const copyButton = document.querySelector(".copy-user");
const copyFeedback = document.querySelector(".copy-feedback");

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(copyButton.dataset.copy);
    copyFeedback.textContent = "Usuario copiado: JonaJSA";
  } catch {
    copyFeedback.textContent = "Usuario de GitHub: JonaJSA";
  }
});

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  document.querySelector(".scroll-progress span").style.width = `${progress}%`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();
document.querySelector("#year").textContent = new Date().getFullYear();
