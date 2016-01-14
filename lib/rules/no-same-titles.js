/**
 * @fileoverview Rule to disallow usage same titles for `it`s inside one `describe`
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict";

var obj = require("../utils/obj.js");
var n = require("../utils/node.js");
var mocha = require("../utils/mocha-specs.js");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

  var insideSuite = false;
  var testTitles = [];
  var nestingLevel = -1;
  var options = context.options[0] || {};
  var skipSkipped = options.hasOwnProperty('skipSkipped') ? options.skipSkipped : false;

  return {
    "FunctionExpression": function (node) {
      if (n.isSuiteBody(node) && !(skipSkipped && n.tryDetectSkipInParent(node))) {
        insideSuite = true;
        nestingLevel++;
        testTitles[nestingLevel] = [];
      }
    },
    "FunctionExpression:exit": function (node) {
      if (n.isSuiteBody(node) && !(skipSkipped && n.tryDetectSkipInParent(node))) {
        var uniqueTitles = testTitles[nestingLevel].filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });
        if (uniqueTitles.length !== testTitles[nestingLevel].length) {
          context.report(node.parent, "Some tests have same titles.");
        }
        insideSuite = false;
        testTitles[nestingLevel] = [];
        nestingLevel--;
      }
    },
    "CallExpression": function (node) {
      if (insideSuite && mocha.tests.indexOf(obj.get(node, "callee.name")) !== -1) {
        var firstArgType = obj.get(node, "arguments.0.type");
        if (firstArgType === "Literal") {
          var title = obj.get(node, "arguments.0.value");
          testTitles[nestingLevel].push(title);
        }
      }
    }
  };
};

module.exports.schema = [
  {
    type: "object",
    properties: {
      skipSkipped: {
        type: "boolean"
      }
    },
    additionalProperties: false
  }
];