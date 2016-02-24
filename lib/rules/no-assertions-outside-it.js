/**
 * @fileoverview Rule to disallow use assertions outside `it`
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

  function check(node) {
    if (!insideIt && n.isParentAssertion(node) && !(skipSkipped && n.tryDetectSkipInParent(node))) {
      context.report(node.parent, "Assertion outside tests is not allowed.");
    }
  }

  function fEnter (node) {
    if (n.isTestBody(node)) {
      insideIt = true;
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
    "ArrowFunctionExpression:exit": fExit,
    "Identifier": check,
    "Literal": check
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