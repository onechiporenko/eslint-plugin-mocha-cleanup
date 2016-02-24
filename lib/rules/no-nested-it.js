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