# AWS SSO Dark

Small unpacked Chrome extension that forces AWS SSO login surfaces into dark mode, so re-authenticating every morning or late at night does not flashbang you.

## Region coverage

This is not tied to `us-east-2`; it should work across AWS regions that use the same SSO URL patterns.

- `https://*.signin.aws/...` covers AWS sign-in hosts across regions that use the standard `signin.aws` pattern.
- `https://*.awsapps.com/...` covers AWS access portal pages across regions.
- Loopback callback detection is port-agnostic for the local OAuth handoff.

## URL coverage

- `https://*.signin.aws/platform/*/login*`
- `https://*.awsapps.com/start/*` when the URL hash includes SSO callback parameters
- `http://127.0.0.1:<any-port>/oauth/callback*`
- `http://localhost:<any-port>/oauth/callback*`

## How it works

The extension injects a content script at `document_start`, tags supported pages, and applies the right dark-mode strategy for each surface:

- AWS-hosted sign-in pages use a filter-based dark theme with reinversion for logos and image-like content.
- Local loopback OAuth callback pages use explicit dark CSS so the full browser viewport goes dark, not just the success message.

## Load locally

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the project folder you cloned or extracted locally.

## Local development

Install dependencies once:

```sh
npm install
npm run hooks:install
```

When tweaking the theme, keep the AWS callback tab open:

1. Edit the extension files.
2. Click **Reload** for the unpacked extension in `chrome://extensions`.
3. Return to the AWS SSO or callback tab.
4. Click the AWS SSO Dark extension icon.
5. Click **Apply to this tab**.

This reinjects the latest local `src/theme.css` and reruns `src/content.js`, so you can iterate without starting another SSO flow.

## Checks

Run the same checks locally that GitHub Actions runs:

```sh
npm run check
```

That verifies Prettier formatting, manifest JSON, JavaScript syntax, and a small obvious-secret pattern scan.

## Notes

- This is intended for local use and easy open-sourcing.
- The icon is AWS-inspired and generated locally in this repo.
- The current match patterns are intentionally generic rather than hardcoding specific AWS regions.
