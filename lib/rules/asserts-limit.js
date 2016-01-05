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
  var assertLimit = context.options[0] >= 1 ? context.options[0] : 3;
  var skipSkipped = context.options.length > 1 ? context.options[1] : false;
  var nodeSkipped;

  return {
    "FunctionExpression": function (node) {
      if (n.isItBody(node)) {
        if (skipSkipped) {
          nodeSkipped = n.tryDetectSkipInParent(node);
        }
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
        if (assertCounter === 0 && !nodeSkipped) {
          context.report(node, "`it` without assertions is not allowed.");
        }
        insideIt = false;
        nodeSkipped = false;
        assertCounter = 0;
      }
    },
    "Identifier": function (node) {
      if (!insideIt) {
        return;
      }
      if (nodeSkipped) {
        return;
      }
      if (n.isParentAssertion(node)) {
        return assertCounter++;
      }
    }
  };
};