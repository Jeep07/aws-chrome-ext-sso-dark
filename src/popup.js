const applyButton = document.querySelector("#apply");
const statusText = document.querySelector("#status");

function setStatus(message) {
  statusText.textContent = message;
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab?.id) {
    throw new Error("No active tab found.");
  }

  return tab;
}

async function applyToActiveTab() {
  applyButton.disabled = true;
  setStatus("Applying...");

  try {
    const tab = await getActiveTab();

    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ["src/theme.css"]
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["src/content.js"]
    });

    setStatus("Applied. No SSO rerun needed.");
  } catch (error) {
    setStatus(error.message || "Could not apply to this tab.");
  } finally {
    applyButton.disabled = false;
  }
}

applyButton.addEventListener("click", applyToActiveTab);
