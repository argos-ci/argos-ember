/**
 * Get the port number from the URL.
 */
function getPort(url) {
  const INITIAL_PORT = 4320;
  const urlObj = new URL(url);
  const browserId = urlObj.searchParams.get("browser");
  if (browserId) {
    return INITIAL_PORT + parseInt(browserId, 10);
  }
  return INITIAL_PORT;
}

/**
 * @param {string} name
 * @param {import('@argos-ci/puppeteer').ArgosScreenshotOptions} options
 */
export async function argosScreenshot(name, options) {
  const port = getPort(window.location.href);
  const res = await fetch(`http://127.0.0.1:${port}/screenshot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, ...options }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to take screenshot\n${text}`);
  }
}
