/**
 * @fileoverview Rule to disallow use assertions outside tests
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict"

const n = require("../utils/node.js")
const m = require("../utils/mocha-specs.js")
const obj = require("../utils/obj.js")
const { isSkipSkipped } = require("../utils/options.js")
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create (context) {
    let insideIt = false
    const options = context.options[0] || {}
    const skipSkipped = isSkipSkipped(options, context)

    const message = "Assertion outside tests is not allowed."

    function check (node) {
      if (!insideIt && n.isAssertion(node) && !(skipSkipped && n.tryDetectSkipInParent(node))) {
        let parentNode = node.parent
        const types = ["FunctionExpression", "ArrowFunctionExpression"]

        while (parentNode) {
          const { type } = parentNode
          if (type === "FunctionDeclaration") {
            return
          }
          if (types.includes(type)) {
            const caller = n.getCaller(parentNode.parent)
            if (!caller) {
              return
            }
            if (m.allSuites.includes(caller) || obj.get(parentNode, "parent.arguments.1") === parentNode) {
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
