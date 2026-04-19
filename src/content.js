const URL_RULES = [
  {
    hostPattern: /\.signin\.aws$/i,
    pathPattern: /^\/platform\/[^/]+\/login/i,
    themeClass: "aws-sso-dark-invert"
  },
  {
    hostPattern: /\.awsapps\.com$/i,
    pathPattern: /^\/start\//i,
    themeClass: "aws-sso-dark-invert"
  },
  {
    hostPattern: /^(127\.0\.0\.1|localhost)$/i,
    pathPattern: /^\/oauth\/callback/i,
    themeClass: "aws-sso-dark-loopback"
  }
];

function getThemeClass(locationLike) {
  const match = URL_RULES.find(({ hostPattern, pathPattern }) => {
    const hostMatches = hostPattern.test(locationLike.hostname);
    const pathMatches = pathPattern.test(locationLike.pathname);
    return hostMatches && pathMatches;
  });

  return match?.themeClass;
}

function applyDarkModeMarker(themeClass) {
  const root = document.documentElement;
  if (!root) {
    return;
  }

  root.classList.add("aws-sso-dark");
  root.classList.add(themeClass);
  root.dataset.awsSsoDark = "true";
  root.dataset.awsSsoDarkTheme = themeClass;
}

function boot() {
  const themeClass = getThemeClass(window.location);
  if (!themeClass) {
    return;
  }

  applyDarkModeMarker(themeClass);

  const observer = new MutationObserver(() => {
    applyDarkModeMarker(themeClass);
  });

  observer.observe(document, {
    childList: true,
    subtree: true
  });
}

boot();
