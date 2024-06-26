#!/usr/bin/env node

import puppeteer from "puppeteer";
import express from "express";
import cors from "cors";
import { argosScreenshot } from "@argos-ci/puppeteer";

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

(async () => {
  const argv = Array.from(process.argv);
  const url = argv.pop();
  const execIndex = argv.findIndex(
    (value) =>
      value.endsWith("argos-chrome") || value.endsWith("run-chrome.mjs"),
  );
  const args = argv.slice(execIndex + 1);
  const headless = args.includes("--headless");
  const port = getPort(url);
  const viewport = (() => {
    const windowSizeArg = args.find((arg) => arg.startsWith("--window-size="));
    if (!windowSizeArg) {
      return null;
    }
    // Example --window-size=1440,900
    // Parse the size from the argument
    const match = windowSizeArg.match(/=(\d+),(\d+)/);
    if (!match) {
      return null;
    }
    const [, width, height] = match;
    return { width: parseInt(width, 10), height: parseInt(height, 10) };
  })();

  const app = express();

  app.use(cors());

  app.use((req, res, next) => {
    next();
  });

  app.post("/screenshot", express.json(), async (req, res) => {
    try {
      // Take a screenshot of the page
      const emberTesting = await page.$("#ember-testing");
      if (!emberTesting) {
        throw new Error("No #ember-testing element found");
      }

      const emberTestingContainer = await page.$("#ember-testing-container");
      if (!emberTesting) {
        throw new Error("No #ember-testing-container element found");
      }

      const { name, ...options } = req.body;

      // Emulate prefers-reduced-motion: reduce
      await page.emulateMediaFeatures([
        { name: "prefers-reduced-motion", value: "reduce" },
      ]);

      // Resize ember-testing to the viewport
      await emberTesting.evaluate((element) => {
        element.style.width = "auto";
        element.style.height = "auto";
        element.style.transform = "none";
      });

      await emberTestingContainer.evaluate((element) => {
        element.style.width = "100vw";
        element.style.height = "fit-content";
        element.style.left = "0";
        element.style.top = "0";
      });

      await argosScreenshot(page, name, {
        element: emberTesting,
        ...options,
      });

      // Reset the styles
      await emberTesting.evaluate((element) => {
        element.style.width = "";
        element.style.height = "";
        element.style.transform = "";
      });

      await emberTestingContainer.evaluate((element) => {
        element.style.width = "";
        element.style.height = "";
        element.style.left = "";
        element.style.top = "";
      });

      res.sendStatus(200);
    } catch (error) {
      res.send(error.stack);
      console.error(error);
      res.sendStatus(500);
    }
  });

  const server = app.listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
  });

  process.on("SIGTERM", () => {
    server.close();
  });

  const browser = await puppeteer.launch({ headless, args });

  process.on("SIGTERM", () => {
    browser.close();
  });

  const pages = await browser.pages();

  const [page] = pages;

  if (viewport) {
    await page.setViewport(viewport);
  }

  await page.goto(url);
})();
