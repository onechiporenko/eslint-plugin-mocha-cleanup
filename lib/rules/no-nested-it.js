/**
 * @fileoverview Rule to disallow usage nested `it`
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict"

const n = require("../utils/node.js")
const { isSkipSkipped } = require("../utils/options.js")
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create (context) {
    let insideIt = false
    const options = context.options[0] || {}
    const skipSkipped = isSkipSkipped(options, context)

    function fEnter (node) {
      if (n.isTestBody(node)) {
        if (insideIt && !(skipSkipped && n.tryDetectSkipInParent(node))) {
          context.report(node.parent, "Nested tests are not allowed. Only nested suites are allowed.")
        } else {
          insideIt = true
        }
      }
    }

    function fExit (node) {
      if (n.isTestBody(node)) {
        insideIt = false
      }
    }

    return {
      FunctionExpression: fEnter,
      ArrowFunctionExpression: fEnter,
      "FunctionExpression:exit": fExit,
      "ArrowFunctionExpression:exit": fExit
    }
  },

  meta: {
    type: "problem",
    schema: [
      {
        type: "object",
        properties: {
          skipSkipped: {
            type: "boolean"
          }
        },
        additionalProperties: false
      }
    ]
  }
}
