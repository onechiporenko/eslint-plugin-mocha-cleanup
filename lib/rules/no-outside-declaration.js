/**
 * @fileoverview Rule to disallow variables declaration outside tests and hooks
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
    let insideSuite = false
    let insideHookOrTest = false
    const options = context.options[0] || {}
    const skipSkipped = isSkipSkipped(options, context)
    const m = "Variable declaration is not allowed outside tests and hooks."

    function fEnter (node) {
      if (n.isSuiteBody(node) && !insideSuite) {
        insideSuite = true
      }
      if (n.isTestBody(node) || n.isHookBody(node)) {
        insideHookOrTest = true
      }
    }

    function fExit (node) {
      if (n.isTestBody(node) || n.isHookBody(node)) {
        insideHookOrTest = false
      }
    }

    return {
      FunctionExpression: fEnter,
      ArrowFunctionExpression: fEnter,
      "FunctionExpression:exit": fExit,
      "ArrowFunctionExpression:exit": fExit,
      VariableDeclaration (node) {
        if (insideSuite && !insideHookOrTest && !(skipSkipped && n.tryDetectSkipInParent(node))) {
          context.report(node, m)
        }
      }
    }
  },

  meta: {
    type: "suggestion",
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
