/**
 * @fileoverview Rule to disallow usage `stub/spy/restore` in the `it`
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict";

var obj = require("../utils/obj.js");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

  var disallowed = ["stub", "spy", "restore"];
  var insideIt = false;

  return {
    "FunctionExpression": function (node) {
      if (obj.get(node, "parent.callee.name") === "it" && obj.get(node, "parent.arguments.1") === node) {
        insideIt = true;
      }
    },
    "FunctionExpression:exit": function (node) {
      if (obj.get(node, "parent.callee.name") === "it" && obj.get(node, "parent.arguments.1") === node) {
        insideIt = false;
      }
    },
    "Identifier": function (node) {
      if (obj.get(node, "parent.parent.type") !== "CallExpression") {
        return;
      }
      if (obj.get(node, "parent.property.name") !== node.name) {
        return;
      }
      if (insideIt && disallowed.indexOf(node.name) !== -1) {
        context.report(node, "`{{name}}` is not allowed to use inside `it`.", {name: node.name});
      }
    }
  };
};