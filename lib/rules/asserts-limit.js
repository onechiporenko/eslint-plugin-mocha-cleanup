/**
 * @fileoverview Rule to disallow use more than allowed number of assertions. `it`s without any assertions are also disallowed
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
  var insideIt = false;
  var assertsCounter = 0;
  var options = context.options[0] || {};
  var assertsLimit = options.assertsLimit >= 1 ? options.assertsLimit : 3;
  var skipSkipped = hasOwnProperty.call(options, "skipSkipped") ? options.skipSkipped : false;
  var ignoreZeroAssertionsIfDoneExists = hasOwnProperty.call(options, "ignoreZeroAssertionsIfDoneExists") ? options.ignoreZeroAssertionsIfDoneExists : true;
  var nodeSkipped;
  var doneExists;

  function check(node) {
    if (!insideIt || nodeSkipped) {
      return;
    }
    if (n.isAssertion(node)) {
      return assertsCounter++;
    }
  }

  function fEnter(node) {
    if (n.isTestBody(node)) {
      if (skipSkipped) {
        nodeSkipped = n.tryDetectSkipInParent(node);
      }
      doneExists = node.params.length > 0;
      insideIt = true;
    }
  }

  function fExit(node) {
    if (n.isTestBody(node)) {
      if (assertsCounter > assertsLimit) {
        context.report(node.parent, "Too many assertions ({{num}}). Maximum allowed is {{max}}.", {
          max: assertsLimit,
          num: assertsCounter
        });
      }
      if (assertsCounter === 0 && !nodeSkipped && !(ignoreZeroAssertionsIfDoneExists && doneExists)) {
        context.report(node.parent, "Test without assertions is not allowed.");
      }
      insideIt = false;
      nodeSkipped = false;
      doneExists = false;
      assertsCounter = 0;
    }
  }

  return {
    "FunctionExpression": fEnter,
    "ArrowFunctionExpression": fEnter,
    "FunctionExpression:exit": fExit,
    "ArrowFunctionExpression:exit": fExit,
    "MemberExpression": check,
    "CallExpression": check
  };
};

module.exports.schema = [
  {
    type: "object",
    properties: {
      assertsLimit: {
        type: "number"
      },
      skipSkipped: {
        type: "boolean"
      },
      ignoreZeroAssertionsIfDoneExists: {
        type: "boolean"
      }
    },
    additionalProperties: false
  }
];