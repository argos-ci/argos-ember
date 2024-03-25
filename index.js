"use strict";

const pkg = require("./package");

module.exports = {
  name: pkg.name,
  treeForAddonTestSupport(tree) {
    return this.preprocessJs(tree, "/", this.name, {
      registry: this.registry,
    });
  },
};
