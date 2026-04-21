(() => {
  const THEME_CLASSES = ["aws-sso-dark-invert", "aws-sso-dark-loopback"];

  const URL_RULES = [
    {
      hostPattern: /\.signin\.aws$/i,
      pathPattern: /^\/platform\/[^/]+\/login/i,
      themeClass: "aws-sso-dark-invert",
    },
    {
      hostPattern: /\.awsapps\.com$/i,
      pathPattern: /^\/start\//i,
      hashPattern: /[?#&](callback_url|orchestrator_id)=/i,
      themeClass: "aws-sso-dark-invert",
    },
    {
      hostPattern: /^(127\.0\.0\.1|localhost)$/i,
      pathPattern: /^\/oauth\/callback/i,
      themeClass: "aws-sso-dark-loopback",
    },
  ];

  function getThemeClass(locationLike) {
    const match = URL_RULES.find(
      ({ hostPattern, pathPattern, hashPattern }) => {
        const hostMatches = hostPattern.test(locationLike.hostname);
        const pathMatches = pathPattern.test(locationLike.pathname);
        const hashMatches = !hashPattern || hashPattern.test(locationLike.hash);
        return hostMatches && pathMatches && hashMatches;
      },
    );

    return match?.themeClass;
  }

  function clearDarkModeMarker() {
    const root = document.documentElement;
    if (!root) {
      return;
    }

    root.classList.remove("aws-sso-dark", ...THEME_CLASSES);
    delete root.dataset.awsSsoDark;
    delete root.dataset.awsSsoDarkTheme;
  }

  function applyDarkModeMarker(themeClass) {
    const root = document.documentElement;
    if (!root) {
      return;
    }

    root.classList.remove(...THEME_CLASSES);
    root.classList.add("aws-sso-dark");
    root.classList.add(themeClass);
    root.dataset.awsSsoDark = "true";
    root.dataset.awsSsoDarkTheme = themeClass;
  }

  function syncTheme() {
    const themeClass = getThemeClass(window.location);
    if (!themeClass) {
      clearDarkModeMarker();
      return;
    }

    applyDarkModeMarker(themeClass);
  }

  function boot() {
    if (window.__awsSsoDarkCleanup) {
      window.__awsSsoDarkCleanup();
    }

    syncTheme();

    if (window.__awsSsoDarkObserver) {
      window.__awsSsoDarkObserver.disconnect();
    }

    window.__awsSsoDarkObserver = new MutationObserver(() => {
      syncTheme();
    });

    window.__awsSsoDarkObserver.observe(document, {
      childList: true,
      subtree: true,
    });

    window.addEventListener("hashchange", syncTheme);
    window.addEventListener("popstate", syncTheme);

    window.__awsSsoDarkCleanup = () => {
      window.__awsSsoDarkObserver?.disconnect();
      window.removeEventListener("hashchange", syncTheme);
      window.removeEventListener("popstate", syncTheme);
    };
  }

  boot();
})();
