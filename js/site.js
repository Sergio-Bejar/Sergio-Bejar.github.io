(() => {
  const root = document.documentElement;
  const buttons = [...document.querySelectorAll("[data-lang]")];
  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".navlinks");

  function setLanguage(language) {
    const lang = language === "es" ? "es" : "en";
    root.lang = lang;
    localStorage.setItem("siteLang", lang);
    buttons.forEach((button) => {
      const selected = button.dataset.lang === lang;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    document.querySelectorAll("a[data-preserve-lang]").forEach((anchor) => {
      const url = new URL(anchor.href, window.location.href);
      url.searchParams.set("lang", lang);
      anchor.href = `${url.pathname}${url.search}${url.hash}`;
    });
  }

  const queryLanguage = new URLSearchParams(window.location.search).get("lang");
  setLanguage(queryLanguage || localStorage.getItem("siteLang") || root.lang);
  buttons.forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.lang)));

  if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
  }
})();
