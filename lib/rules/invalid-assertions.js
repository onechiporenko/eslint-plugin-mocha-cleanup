/**
 * @fileoverview Rule to check `expect` and `should` assertions for completeness. It detects assertions that end with "chainable" words or even raw calls for `expect` and `should`
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict"

var n = require("../utils/node.js")
var isSkipSkipped = require("../utils/options.js").isSkipSkipped
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create: function (context) {
    var m = "Invalid assertion usage."
    var insideIt = false
    var options = context.options[0] || {}
    var skipSkipped = isSkipSkipped(options, context)
    var nodeSkipped

    function check (node) {
      if (!insideIt || nodeSkipped) {
        return
      }
      if (n.isAssertion(node)) {
        var parentExpression = n.getParentExpression(node)
        /* istanbul ignore if */
        if (!parentExpression) {
          return
        }
        var caller = n.getCaller(parentExpression.expression) ||
          /* istanbul ignore next */
          ""
        if (["expect", "chai.expect"].indexOf(caller) !== -1) {
          return context.report(node, m)
        }
        var should = "should"
        if (caller.indexOf(should, caller.length - should.length) !== -1) {
          return context.report(node, m)
        }
        n.chaiChainable.forEach(function (c) {
          var _c = "." + c
          if (caller.indexOf(_c, caller.length - _c.length) !== -1) {
            context.report(node, m)
          }
        })
      }
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
      CallExpression: check,
      MemberExpression: check
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
