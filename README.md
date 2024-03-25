# @argos-ci/ember

Argos visual testing SDK for Ember applications.

## Prerequisites

To get most out of this guide, you'll need to:

- Have an app with [Ember testing](https://guides.emberjs.com/v3.28.0/testing/) set up

## Getting started

### 1. Install

```sh
npm install --save-dev puppeteer @argos-ci/ember
```

### 2. Configure testem

Use `argos-chrome` as browser in your testem configuration.

```js
// testem.js
"use strict";

const path = require("path");

const argosChrome = path.resolve(__dirname, "node_modules/.bin/argos-chrome");

module.exports = {
  test_page: "tests/index.html?hidepassed",
  launch_in_ci: ["Chrome"],
  browser_paths: {
    Chrome: argosChrome,
  },
};
```

### 3. Take screenshots

Use `argosScreenshot` to take screenshot of your application.

```js
import { module, test } from "qunit";
import { visit } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import { argosScreenshot } from "@argos-ci/ember";

module("Home", function (hooks) {
  setupApplicationTest(hooks);

  test("takes a screenshot of the homepage", async function () {
    await visit("/");
    await argosScreenshot("home");
  });
});
```

### 4. Setup your CI

Add this command to your CI pipeline to upload the screenshots to Argos.

```js
npm exec -- argos upload --token <ARGOS_TOKEN> ./screenshots
```
