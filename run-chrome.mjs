#!/usr/bin/env node

import puppeteer from "puppeteer";
import express from "express";
import cors from "cors";
import { argosScreenshot } from "@argos-ci/puppeteer";

(async () => {
  const argv = Array.from(process.argv);
  const url = argv.pop();
  const execIndex = argv.findIndex((value) => value.endsWith("argos-chrome"));
  const args = argv.slice(execIndex + 1);

  const app = express();

  app.use(cors());

  app.use((req, res, next) => {
    next();
  });

  app.post("/screenshot", express.json(), async (req, res) => {
    try {
      // Take a screenshot of the page
      const element = await page.$("#ember-testing");
      if (!element) {
        throw new Error("No #ember-testing element found");
      }
      const { name, ...options } = req.body;
      await argosScreenshot(page, name, {
        element,
        ...options,
      });
    } catch (error) {
      res.send(error.stack);
      console.error(error);
      res.sendStatus(500);
    }
  });

  app.listen(4320, () => {
    console.log("Listening on 127.0.0.1:4320");
  });

  const browser = await puppeteer.launch({
    headless: false,
    args,
  });

  const pages = await browser.pages();

  const [page] = pages;

  await page.goto(url);
})();
