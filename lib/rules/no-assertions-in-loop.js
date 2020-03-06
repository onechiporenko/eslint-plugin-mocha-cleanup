/**
 * @fileoverview Rule to disallow use assertions inside loops
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict"

const n = require("../utils/node.js")
const { isSkipSkipped } = require("../utils/options.js")
const { hasOwnProperty } = Object.prototype
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create (context) {
    const loopStatements = ["WhileStatement", "DoWhileStatement", "ForStatement", "ForInStatement", "ForOfStatement"]
    let insideIt = false
    const options = context.options[0] || {}
    const skipSkipped = isSkipSkipped(options, context)
    const extraMemberExpression = hasOwnProperty.call(options, "extraMemberExpression") ? options.extraMemberExpression : []
    let nodeSkipped

    function detectParentLoopInTest (node) {
      /* istanbul ignore if */
      if (!node) {
        return false
      }
      if (n.isTestBody(node)) {
        return false
      }
      const caller = "" + n.getCaller(node)
      let isExtra = false
      extraMemberExpression.forEach(function (str) {
        if (caller.includes(str, caller.length - str.length)) {
          isExtra = true
        }
      })
      if (isExtra || loopStatements.includes(node.type)) {
        return true
      }
      return detectParentLoopInTest(node.parent)
    }

    function fEnter (node) {
      if (n.isTestBody(node)) {
        if (skipSkipped) {
          nodeSkipped = n.tryDetectSkipInParent(node)
        }
        insideIt = true
      }
    }

    function fExit (node) {
      if (n.isTestBody(node)) {
        insideIt = false
        nodeSkipped = false
      }
    }

    return {
      FunctionExpression: fEnter,
      ArrowFunctionExpression: fEnter,

      "FunctionExpression:exit": fExit,
      "ArrowFunctionExpression:exit": fExit,

      MemberExpression (node) {
        if (!insideIt || nodeSkipped) {
          return
        }

        if (n.isSinonAssert(node) || n.isChaiAssert(node) || n.isChaiShould(node)) {
          if (detectParentLoopInTest(node.parent)) {
            context.report(node, "Assertions should not be used in loops.")
          }
        }
      },

      CallExpression (node) {
        if (!insideIt || nodeSkipped) {
          return
        }
        if (n.isChaiExpect(node) || n.isChaiAssert(node)) {
          if (detectParentLoopInTest(node.parent)) {
            context.report(node, "Assertions should not be used in loops.")
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
          },
          extraMemberExpression: {
            type: "array",
            items: {
              type: "string"
            }
          }
        },
        additionalProperties: false
      }
    ]
  }
}
