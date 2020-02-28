/**
 * @fileoverview Rule to disallow use assertions inside loops
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict"

var n = require("../utils/node.js")
var isSkipSkipped = require("../utils/options.js").isSkipSkipped
var hasOwnProperty = Object.prototype.hasOwnProperty
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create: function (context) {
    var loopStatements = ["WhileStatement", "DoWhileStatement", "ForStatement", "ForInStatement", "ForOfStatement"]
    var insideIt = false
    var options = context.options[0] || {}
    var skipSkipped = isSkipSkipped(options, context)
    var extraMemberExpression = hasOwnProperty.call(options, "extraMemberExpression") ? options.extraMemberExpression : []
    var nodeSkipped

    function detectParentLoopInTest (node) {
      /* istanbul ignore if */
      if (!node) {
        return false
      }
      if (n.isTestBody(node)) {
        return false
      }
      var caller = "" + n.getCaller(node)
      var isExtra = false
      extraMemberExpression.forEach(function (str) {
        if (caller.indexOf(str, caller.length - str.length) !== -1) {
          isExtra = true
        }
      })
      if (isExtra || loopStatements.indexOf(node.type) !== -1) {
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

      MemberExpression: function (node) {
        if (!insideIt || nodeSkipped) {
          return
        }

        if (n.isSinonAssert(node) || n.isChaiAssert(node) || n.isChaiShould(node)) {
          if (detectParentLoopInTest(node.parent)) {
            context.report(node, "Assertions should not be used in loops.")
          }
        }
      },

      CallExpression: function (node) {
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
