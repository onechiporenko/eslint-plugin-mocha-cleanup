/**
 * @fileoverview Rule to disallow usage nested `it`
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
        if (insideIt) {
          context.report(node.parent, "Nested `it` is not allowed.");
        }
        else {
          insideIt = true;
        }
      }
    },
    "FunctionExpression:exit": function (node) {
      if (n.isItBody(node)) {
        insideIt = false;
      }
    }
  };
};