/**
 * @fileoverview Rule to disallow use empty tests, suites and hooks
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict"

var n = require("../utils/node.js")
var obj = require("../utils/obj.js")
var mocha = require("../utils/mocha-specs.js")
var isSkipSkipped = require("../utils/options.js").isSkipSkipped
var toCheck = mocha.all.concat(mocha.hooks)

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create: function (context) {
    var options = context.options[0] || {}
    var skipSkipped = isSkipSkipped(options, context)

    function fEnter (node) {
      if (skipSkipped && n.tryDetectSkipInParent(node)) {
        return
      }
      var caller = n.getCaller(node.parent)
      if (toCheck.indexOf(caller) !== -1) {
        if (!obj.get(node, "body.body.length")) {
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
