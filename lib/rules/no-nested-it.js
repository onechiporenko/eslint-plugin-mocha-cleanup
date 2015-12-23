/**
 * @fileoverview Rule to disallow usage nested `it`
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict";

var obj = require("../utils/obj.js");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

  var insideIt = false;

  return {
    "FunctionExpression": function (node) {
      if (obj.get(node, "parent.callee.name") === "it" && obj.get(node, "parent.arguments.1") === node) {
        if (insideIt) {
          context.report(node.parent, "Nested `it` is not allowed.");
        }
        else {
          insideIt = true;
        }
      }
    },
    "FunctionExpression:exit": function (node) {
      if (obj.get(node, "parent.callee.name") === "it" && obj.get(node, "parent.arguments.1") === node) {
        insideIt = false;
      }
    }
  };
};