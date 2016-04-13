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
  var options = context.options[0] || {};
  var maxAllowedComplexity = options.hasOwnProperty("maxAllowedComplexity") ? options.maxAllowedComplexity : 40;
  var skipSkipped = options.hasOwnProperty("skipSkipped") ? options.skipSkipped : false;
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

  function fEnter (node) {
    if (n.isTestBody(node)) {
      if (skipSkipped) {
        nodeSkipped = n.tryDetectSkipInParent(node);
      }
      insideIt = true;
    }
  }

  function fExit (node) {
    if (n.isTestBody(node)) {
      if (currentComplexityCount > maxAllowedComplexity) {
        context.report(node.parent, "`{{name}}` has a complexity of {{num}}. Maximum allowed is {{max}}.", {
          max: maxAllowedComplexity,
          num: currentComplexityCount,
          name: n.getCaller(node.parent)
        });
      }
      insideIt = false;
      nodeSkipped = false;
      currentComplexityCount = 0;
    }
  }

  return {
    "FunctionExpression": fEnter,
    "ArrowFunctionExpression": fEnter,
    "FunctionExpression:exit": fExit,
    "ArrowFunctionExpression:exit": fExit,

    "MemberExpression": function (node) {
      if (n.isSinonAssert(node) || n.isChaiAssert(node) || n.isChaiShould(node) || n.isChaiChainable(node)) {
        return;
      }
      increaseComplexity();
    },

    "CallExpression": function (node) {
      if (n.isChaiExpect(node)) {
        return;
      }
      increaseComplexity();
    },

    "FunctionDeclaration": increaseComplexity,
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

module.exports.schema = [
  {
    type: "object",
    properties: {
      maxAllowedComplexity: {
        type: "number"
      },
      skipSkipped: {
        type: "boolean"
      }
    },
    additionalProperties: false
  }
];