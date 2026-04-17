# AWS SSO Dark

Small unpacked Chrome extension that forces AWS SSO login surfaces into dark mode, so re-authenticating every morning or late at night does not flashbang you.

## Region coverage

This is not tied to `us-east-2` etc. should be good across all regions.

- `https://*.signin.aws/...` covers AWS sign-in hosts across regions that use the standard `signin.aws` pattern.
- `https://*.awsapps.com/...` covers AWS access portal pages across regions.
- Loopback callback detection is port-agnostic for the local OAuth handoff.

## URL coverage

- `https://*.signin.aws/platform/*/login*`
- `https://*.awsapps.com/start/*`
- `http://127.0.0.1:<any-port>/oauth/callback*`
- `http://localhost:<any-port>/oauth/callback*`

## How it works

The extension injects a content script at `document_start`, tags supported pages, and applies a filter-based dark theme with reinversion for logos and image-like content.

## Load locally

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the project folder you cloned or extracted locally.

## Notes

- This is intended for local use and easy open-sourcing.
- The icon is AWS-inspired and generated locally in this repo.
- The current match patterns are intentionally generic rather than hardcoding specific AWS regions.
