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
  var skipSkipped = context.options.length >= 1 ? context.options[0] : false;

  return {
    "FunctionExpression": function (node) {
      if (n.isTestBody(node)) {
        insideIt = true;
      }
    },
    "FunctionExpression:exit": function (node) {
      if (n.isTestBody(node)) {
        insideIt = false;
      }
    },
    "Identifier": function (node) {
      if (!insideIt && n.isParentAssertion(node) && !(skipSkipped && n.tryDetectSkipInParent(node))) {
        context.report(node, "Assertion outside tests is not allowed.");
      }
    }
  };
};