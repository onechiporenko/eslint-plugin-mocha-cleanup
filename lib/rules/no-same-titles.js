/**
 * @fileoverview Rule to disallow usage same titles for `it`s inside one `describe`
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict";

var obj = require("../utils/obj.js");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

  var insideDescribe = false;
  var itTitles = [];

  return {
    "FunctionExpression": function (node) {
      if (obj.get(node, "parent.callee.name") === "describe" && obj.get(node, "parent.arguments.1") === node) {
        insideDescribe = true;
      }
    },
    "FunctionExpression:exit": function (node) {
      if (obj.get(node, "parent.callee.name") === "describe" && obj.get(node, "parent.arguments.1") === node) {
        var uniqueTitles = itTitles.filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });
        if (uniqueTitles.length !== itTitles.length) {
          context.report(node, "Some `it` have same titles.");
        }
        insideDescribe = false;
        itTitles = [];
      }
    },
    "CallExpression": function (node) {
      if (insideDescribe && obj.get(node, "callee.name") === 'it') {
        var firstArgType = obj.get(node, "arguments.0.type");
        if (firstArgType === 'Literal') {
          var title = obj.get(node, "arguments.0.value");
          itTitles.push(title);
        }
      }
    }
  };
};