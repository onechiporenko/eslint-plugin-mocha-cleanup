/**
 * @fileoverview Rule to disallow usage `stub/spy/restore` in the `it`
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict"

const obj = require("../utils/obj.js")
const n = require("../utils/node.js")
const { isSkipSkipped } = require("../utils/options.js")
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create (context) {
    const disallowed = ["stub", "spy", "restore"]
    let insideTest = false
    const options = context.options[0] || {}
    const skipSkipped = isSkipSkipped(options, context)
    let nodeSkipped = false
    let caller = ""

    function fEnter (node) {
      if (n.isTestBody(node)) {
        if (skipSkipped) {
          nodeSkipped = n.tryDetectSkipInParent(node)
        }
        insideTest = true
        caller = n.getCaller(node.parent)
      }
    }

    function fExit (node) {
      if (n.isTestBody(node)) {
        insideTest = false
        nodeSkipped = false
        caller = ""
      }
    }

    return {
      FunctionExpression: fEnter,
      ArrowFunctionExpression: fEnter,
      "FunctionExpression:exit": fExit,
      "ArrowFunctionExpression:exit": fExit,

      "CallExpression[callee]" (node) {
        const callee = obj.get(node, "callee")
        const _c = n.cleanCaller(n.getCaller(callee)).split(".").pop()
        if (insideTest && disallowed.includes(_c) && !nodeSkipped) {
          context.report(node, "`{{name}}` is not allowed to use inside `{{caller}}`.", { name: _c, caller })
        }
      }

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
