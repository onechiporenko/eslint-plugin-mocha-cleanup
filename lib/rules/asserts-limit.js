/**
 * @fileoverview Rule to disallow use more than allowed number of assertions
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
  var assertCounter = 0;
  var assertLimit = context.options[0] || 3;

  return {
    "FunctionExpression": function (node) {
      if (n.isItBody(node)) {
        insideIt = true;
      }
    },
    "FunctionExpression:exit": function (node) {
      if (n.isItBody(node)) {
        if (assertCounter > assertLimit) {
          context.report(node, "Too many assertions ({{num}}). Maximum allowed is {{max}}.", {
            max: assertLimit,
            num: assertCounter
          });
        }
        insideIt = false;
        assertCounter = 0;
      }
    },
    "Identifier": function (node) {
      if (!insideIt) {
        return;
      }
      if (n.isAssertion(node)) {
        return assertCounter++;
      }
    }
  };
};