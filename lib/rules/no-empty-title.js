/**
 * @fileoverview Rule to disallow use empty title in the `describe` and `it`
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict"

const obj = require("../utils/obj.js")
const n = require("../utils/node.js")
const mocha = require("../utils/mocha-specs.js")
const isSkipSkipped = require("../utils/options.js").isSkipSkipped
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create: function (context) {
    const options = context.options[0] || {}
    const skipSkipped = isSkipSkipped(options, context)

    return {
      CallExpression: function (node) {
        const caller = n.getCaller(node)
        if (!caller || mocha.all.indexOf(caller) === -1) {
          return
        }
        if (skipSkipped && (mocha.allSkipped.indexOf(caller) !== -1 || n.tryDetectSkipInParent(node))) {
          return
        }

        const firstArgType = obj.get(node, "arguments.0.type")
        if (firstArgType === "Literal") {
          const title = "" + obj.get(node, "arguments.0.value") || ""
          if (!title.trim()) {
            context.report(node, "Empty title is not allowed for `{{name}}`.", { name: caller })
          }
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
