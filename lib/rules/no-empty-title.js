/**
 * @fileoverview Rule to disallow use empty title in the `describe` and `it`
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict"

var obj = require("../utils/obj.js")
var n = require("../utils/node.js")
var mocha = require("../utils/mocha-specs.js")
var isSkipSkipped = require("../utils/options.js").isSkipSkipped
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create: function (context) {
    var options = context.options[0] || {}
    var skipSkipped = isSkipSkipped(options, context)

    return {
      CallExpression: function (node) {
        var caller = n.getCaller(node)
        if (!caller || mocha.all.indexOf(caller) === -1) {
          return
        }
        if (skipSkipped && (mocha.allSkipped.indexOf(caller) !== -1 || n.tryDetectSkipInParent(node))) {
          return
        }

        var firstArgType = obj.get(node, "arguments.0.type")
        if (firstArgType === "Literal") {
          var title = "" + obj.get(node, "arguments.0.value") || ""
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
