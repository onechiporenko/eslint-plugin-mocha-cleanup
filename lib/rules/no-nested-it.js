/**
 * @fileoverview Rule to disallow usage nested `it`
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict";

var n = require("../utils/node.js");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

  var insideIt = false;
  var options = context.options[0] || {};
  var skipSkipped = options.hasOwnProperty("skipSkipped") ? options.skipSkipped : false;

  return {
    "FunctionExpression": function (node) {
      if (n.isTestBody(node)) {
        if (insideIt && !(skipSkipped && n.tryDetectSkipInParent(node))) {
          context.report(node.parent, "Nested tests are not allowed. Only nested suites are allowed.");
        }
        else {
          insideIt = true;
        }
      }
    },
    "FunctionExpression:exit": function (node) {
      if (n.isTestBody(node)) {
        insideIt = false;
      }
    }
  };
};

module.exports.schema = [
  {
    type: "object",
    properties: {
      skipSkipped: {
        type: "boolean"
      }
    },
    additionalProperties: false
  }
];