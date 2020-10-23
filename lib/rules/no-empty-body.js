/**
 * @fileoverview Rule to disallow use empty tests, suites and hooks
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict"

const n = require("../utils/node.js")
const obj = require("../utils/obj.js")
const mocha = require("../utils/mocha-specs.js")
const { isSkipSkipped } = require("../utils/options.js")
const toCheck = mocha.all.concat(mocha.hooks)

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create (context) {
    const options = context.options[0] || {}
    const skipSkipped = isSkipSkipped(options, context)

    function fEnter (node) {
      if (skipSkipped && n.tryDetectSkipInParent(node)) {
        return
      }
      const caller = n.getCaller(node.parent)
      if (toCheck.includes(caller)) {
        const nodeBodyType = obj.get(node, "body.type") || ""
        if (!obj.get(node, "body.body.length") && !nodeBodyType.includes("Expression")) {
          context.report(node, "Empty function is not allowed here.")
        }
      }
    }

    return {
      FunctionExpression: fEnter,
      ArrowFunctionExpression: fEnter
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
