const URL_RULES = [
  {
    hostPattern: /\.signin\.aws$/i,
    pathPattern: /^\/platform\/[^/]+\/login/i
  },
  {
    hostPattern: /\.awsapps\.com$/i,
    pathPattern: /^\/start\//i
  },
  {
    hostPattern: /^(127\.0\.0\.1|localhost)$/i,
    pathPattern: /^\/oauth\/callback/i
  }
];

function isSupportedLocation(locationLike) {
  return URL_RULES.some(({ hostPattern, pathPattern }) => {
    const hostMatches = hostPattern.test(locationLike.hostname);
    const pathMatches = pathPattern.test(locationLike.pathname);
    return hostMatches && pathMatches;
  });
}

function applyDarkModeMarker() {
  const root = document.documentElement;
  if (!root || root.classList.contains("aws-sso-dark")) {
    return;
  }

  root.classList.add("aws-sso-dark");
  root.dataset.awsSsoDark = "true";
}

function boot() {
  if (!isSupportedLocation(window.location)) {
    return;
  }

  applyDarkModeMarker();

  const observer = new MutationObserver(() => {
    applyDarkModeMarker();
  });

  observer.observe(document, {
    childList: true,
    subtree: true
  });
}

boot();
