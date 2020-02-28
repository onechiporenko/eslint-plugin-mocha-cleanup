/**
 * @fileoverview Rule to disallow use assertions outside tests
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict"

var n = require("../utils/node.js")
var m = require("../utils/mocha-specs.js")
var obj = require("../utils/obj.js")
var isSkipSkipped = require("../utils/options.js").isSkipSkipped
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create: function (context) {
    var insideIt = false
    var options = context.options[0] || {}
    var skipSkipped = isSkipSkipped(options, context)

    var message = "Assertion outside tests is not allowed."

    function check (node) {
      if (!insideIt && n.isAssertion(node) && !(skipSkipped && n.tryDetectSkipInParent(node))) {
        var parentNode = node.parent
        var types = ["FunctionExpression", "ArrowFunctionExpression"]

        while (parentNode) {
          var type = parentNode.type
          if (type === "FunctionDeclaration") {
            return
          }
          if (types.indexOf(type) !== -1) {
            var caller = n.getCaller(parentNode.parent)
            if (!caller) {
              return
            }
            if (m.allSuites.indexOf(caller) !== -1 || obj.get(parentNode, "parent.arguments.1") === parentNode) {
              return context.report(node.parent, message)
            }
          }
          parentNode = parentNode.parent
        }
        return context.report(node.parent, message)
      }
    }

    function fEnter (node) {
      if (n.isTestBody(node)) {
        insideIt = true
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
      "ArrowFunctionExpression:exit": fExit,
      MemberExpression: check,
      CallExpression: check
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
