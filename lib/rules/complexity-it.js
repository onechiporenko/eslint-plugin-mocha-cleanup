/**
 * @fileoverview Counts `it`-body complexity
 * Rule based on "default" `complexity`-rule implementation
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
  var currentComplexityCount = 0;
  var maxAllowedComplexity = context.options.length ? context.options[0] : 40;
  var skipSkipped = context.options.length > 1 ? context.options[1] : false;
  var nodeSkipped;

  function increaseComplexity() {
    if (!insideIt) {
      return;
    }
    if (nodeSkipped) {
      return;
    }
    currentComplexityCount++;
  }

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
        if (currentComplexityCount > maxAllowedComplexity) {
          context.report(node, "`it` has a complexity of {{num}}. Maximum allowed is {{max}}.", {
            max: maxAllowedComplexity,
            num: currentComplexityCount
          });
        }
        insideIt = false;
        nodeSkipped = false;
        currentComplexityCount = 0;
      }
    },

    "MemberExpression": function (node) {
      if (n.isAssert(node) || n.isShould(node)) {
        return;
      }
      increaseComplexity();
    },

    "CallExpression": function (node) {
      if (n.isExpect(node)) {
        return;
      }
      increaseComplexity();
    },

    "FunctionDeclaration": increaseComplexity,
    "ArrowFunctionExpression": increaseComplexity,
    "ExpressionStatement": increaseComplexity,
    "CatchClause": increaseComplexity,
    "ConditionalExpression": increaseComplexity,
    "LogicalExpression": increaseComplexity,
    "ForStatement": increaseComplexity,
    "ForInStatement": increaseComplexity,
    "ForOfStatement": increaseComplexity,
    "IfStatement": increaseComplexity,
    "SwitchCase": increaseComplexity,
    "WhileStatement": increaseComplexity,
    "DoWhileStatement": increaseComplexity

  };
};