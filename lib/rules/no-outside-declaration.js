/**
 * @fileoverview Rule to disallow variables declaration outside tests and hooks
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict";

var n = require("../utils/node.js");
var hasOwnProperty = Object.prototype.hasOwnProperty;
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

  var insideSuite = false;
  var insideHookOrTest = false;
  var options = context.options[0] || {};
  var skipSkipped = hasOwnProperty.call(options, "skipSkipped") ? options.skipSkipped : false;
  var m = "Variable declaration is not allowed outside tests and hooks.";

  function fEnter (node) {
    if (n.isSuiteBody(node) && !insideSuite) {
      insideSuite = true;
    }
    if (n.isTestBody(node) || n.isHookBody(node)) {
      insideHookOrTest = true;
    }
  }

  function fExit (node) {
    if (n.isTestBody(node) || n.isHookBody(node)) {
      insideHookOrTest = false;
    }
  }

  return {
    "FunctionExpression": fEnter,
    "ArrowFunctionExpression": fEnter,
    "FunctionExpression:exit": fExit,
    "ArrowFunctionExpression:exit": fExit,
    "VariableDeclaration": function (node) {
      if (insideSuite && !insideHookOrTest && !(skipSkipped && n.tryDetectSkipInParent(node))) {
        context.report(node, m);
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
