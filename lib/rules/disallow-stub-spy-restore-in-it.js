/**
 * @fileoverview Rule to disallow usage `stub/spy/restore` in the `it`
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict";

var obj = require("../utils/obj.js");
var n = require("../utils/node.js");
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

  var disallowed = ["stub", "spy", "restore"];
  var insideIt = false;
  var skipSkipped = context.options.length >= 1 ? context.options[0] : false;
  var nodeSkipped = false;

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
        insideIt = false;
        nodeSkipped = false;
      }
    },
    "Identifier": function (node) {
      if (obj.get(node, "parent.parent.type") !== "CallExpression") {
        return;
      }
      if (obj.get(node, "parent.property.name") !== node.name) {
        return;
      }
      if (insideIt && disallowed.indexOf(node.name) !== -1 && !nodeSkipped) {
        context.report(node, "`{{name}}` is not allowed to use inside `it`.", {name: node.name});
      }
    }
  };
};