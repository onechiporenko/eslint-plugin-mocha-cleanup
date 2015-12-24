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

  return {
    "FunctionExpression": function (node) {
      if (n.isItBody(node)) {
        insideIt = true;
      }
    },
    "FunctionExpression:exit": function (node) {
      if (n.isItBody(node)) {
        insideIt = false;
      }
    },
    "Identifier": function (node) {
      if (!insideIt && n.isAssertion(node)) {
          context.report(node, "Assertion outside `it` is not allowed.");
      }
    }
  };
};