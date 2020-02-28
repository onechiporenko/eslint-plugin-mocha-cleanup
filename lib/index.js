/**
 * @fileoverview eslint-plugin-mocha-cleanup
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------
const path = require("path")
const requireIndex = require("requireindex")

// ------------------------------------------------------------------------------
// Plugin Definition
// ------------------------------------------------------------------------------

// import all rules in lib/rules
module.exports = {
  rules: requireIndex(path.resolve(__dirname, "./rules")),
  configs: {
    recommended: {
      plugins: ["mocha-cleanup"],
      rules: {
        "mocha-cleanup/asserts-limit": 2,
        "mocha-cleanup/disallow-stub-spy-restore-in-it": 2,
        "mocha-cleanup/no-empty-title": 2,
        "mocha-cleanup/no-same-titles": 2,
        "mocha-cleanup/no-nested-it": 2,
        "mocha-cleanup/no-assertions-outside-it": 2,
        "mocha-cleanup/complexity-it": 2,
        "mocha-cleanup/no-eql-primitives": 2,
        "mocha-cleanup/no-assertions-in-loop": 2,
        "mocha-cleanup/no-empty-body": 2,
        "mocha-cleanup/invalid-assertions": 2,
        "mocha-cleanup/no-expressions-in-assertions": 2,
        "mocha-cleanup/no-outside-declaration": 2
      }
    },
    "recommended-no-limits": {
      plugins: ["mocha-cleanup"],
      rules: {
        // "mocha-cleanup/asserts-limit": 0,
        "mocha-cleanup/disallow-stub-spy-restore-in-it": 2,
        "mocha-cleanup/no-empty-title": 2,
        "mocha-cleanup/no-same-titles": 2,
        "mocha-cleanup/no-nested-it": 2,
        "mocha-cleanup/no-assertions-outside-it": 2,
        // "mocha-cleanup/complexity-it": 0,
        "mocha-cleanup/no-eql-primitives": 2,
        "mocha-cleanup/no-assertions-in-loop": 2,
        "mocha-cleanup/no-empty-body": 2,
        "mocha-cleanup/invalid-assertions": 2,
        "mocha-cleanup/no-expressions-in-assertions": 2,
        "mocha-cleanup/no-outside-declaration": 2
      }
    }
  }
}
