// Theme toggle with system-preference default and localStorage persistence.
(function () {
  const root = document.documentElement;
  const toggle = document.querySelector(".theme-toggle");
  const STORAGE_KEY = "theme";

  function systemPrefersDark() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    if (toggle) toggle.setAttribute("aria-pressed", String(theme === "dark"));
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  apply(saved || (systemPrefersDark() ? "dark" : "light"));

  if (toggle) {
    toggle.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  }
})();
