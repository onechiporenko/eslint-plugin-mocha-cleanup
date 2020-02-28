/**
 * @fileoverview Rule to disallow usage nested `it`
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict";

var n = require("../utils/node.js");
var isSkipSkipped = require("../utils/options.js").isSkipSkipped;
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  create: function (context) {

    var insideIt = false;
    var options = context.options[0] || {};
    var skipSkipped = isSkipSkipped(options, context);

    function fEnter (node) {
      if (n.isTestBody(node)) {
        if (insideIt && !(skipSkipped && n.tryDetectSkipInParent(node))) {
          context.report(node.parent, "Nested tests are not allowed. Only nested suites are allowed.");
        }
        else {
          insideIt = true;
        }
      }
    }

    function fExit (node) {
      if (n.isTestBody(node)) {
        insideIt = false;
      }
    }

    return {
      "FunctionExpression": fEnter,
      "ArrowFunctionExpression": fEnter,
      "FunctionExpression:exit": fExit,
      "ArrowFunctionExpression:exit": fExit
    };
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
