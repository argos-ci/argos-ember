/**
 * @param {string} name
 * @param {import('@argos-ci/puppeteer').ArgosScreenshotOptions} options
 */
export async function argosScreenshot(name, options) {
  const port = process.env.PUPPETEER_API_PORT
    ? Number(process.env.PUPPETEER_API_PORT)
    : 4320;
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
