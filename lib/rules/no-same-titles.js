/**
 * @fileoverview Rule to disallow usage same titles for `it`s inside one `describe`
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

  var insideDescribe = false;
  var itTitles = [];
  var skipSkipped = context.options.length >= 1 ? context.options[0] : false;

  return {
    "FunctionExpression": function (node) {
      if (n.isDescribeBody(node) && !(skipSkipped && n.tryDetectSkipInParent(node))) {
        insideDescribe = true;
      }
    },
    "FunctionExpression:exit": function (node) {
      if (n.isDescribeBody(node)) {
        var uniqueTitles = itTitles.filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });
        if (uniqueTitles.length !== itTitles.length) {
          context.report(node.parent, "Some `it` have same titles.");
        }
        insideDescribe = false;
        itTitles = [];
      }
    },
    "CallExpression": function (node) {
      if (insideDescribe && obj.get(node, "callee.name") === "it") {
        var firstArgType = obj.get(node, "arguments.0.type");
        if (firstArgType === "Literal") {
          var title = obj.get(node, "arguments.0.value");
          itTitles.push(title);
        }
      }
    }
  };
};