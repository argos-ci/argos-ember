import type { ArgosScreenshotOptions as PuppeteerArgosScreenshotOptions } from "@argos-ci/puppeteer";

// present when qunit types are used
declare global {
  interface Assert {}
}

// present when mocha types are used
declare namespace Mocha {
  class Test {}
}

export type ArgosScreenshotOptions = Omit<
  PuppeteerArgosScreenshotOptions,
  "element"
>;

/**
 * Take a screenshot of the current page.
 */
export default function argosScreenshot(
  name: string,
  options?: ArgosScreenshotOptions,
): Promise<void>;
