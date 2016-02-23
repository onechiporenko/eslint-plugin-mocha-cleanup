/**
 * @fileoverview Rule to disallow usage same titles for `it`s inside one `describe` or in the whole file. It depends on `scope` value - may be `file` or `suite`. Default - `suite`
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
  var options = context.options[0] || {};
  var skipSkipped = options.hasOwnProperty("skipSkipped") ? options.skipSkipped : false;
  var scope = options.hasOwnProperty("scope") ? options.scope : "suite";
  var checkNesting = scope === "suite";
  var nestingLevel = checkNesting ? -1 : 0;

  function report(level) {
    Object.keys(testTitles[level]).forEach(function (title) {
      if (testTitles[level][title].length > 1) {
        testTitles[level][title].forEach(function(node) {
          context.report(node, "Some tests have same titles.");
        });
      }
    });
  }

  return {
    "FunctionExpression": function (node) {
      if (n.isSuiteBody(node) && !(skipSkipped && n.tryDetectSkipInParent(node))) {
        insideSuite = true;
        if (checkNesting) {
          nestingLevel++;
        }
        if (!testTitles[nestingLevel]) {
          testTitles[nestingLevel] = {};
        }
      }
    },
    "FunctionExpression:exit": function (node) {
      if (n.isSuiteBody(node) && !(skipSkipped && n.tryDetectSkipInParent(node))) {
        insideSuite = false;
        if (checkNesting) {
          report(nestingLevel);
          testTitles[nestingLevel] = {};
          nestingLevel--;
        }
      }
    },
    "CallExpression": function (node) {
      if (insideSuite  && !(skipSkipped && n.tryDetectSkipInParent(node)) && mocha.tests.indexOf(obj.get(node, "callee.name")) !== -1) {
        var firstArgType = obj.get(node, "arguments.0.type");
        if (firstArgType === "Literal") {
          var title = obj.get(node, "arguments.0.value");
          if (!testTitles[nestingLevel][title]) {
            testTitles[nestingLevel][title] = [];
          }
          testTitles[nestingLevel][title].push(node);
        }
      }
    },
    "Program:exit": function () {
      if (checkNesting) {
        return;
      }
      testTitles.forEach(function (level) {
        Object.keys(level).forEach(function (title) {
          if (level[title].length > 1) {
            level[title].forEach(function(node) {
              context.report(node, "Some tests have same titles.");
            });
          }
        });
      });
    }
  };
};

module.exports.schema = [
  {
    type: "object",
    properties: {
      scope: {
        enum: ["suite", "file"]
      },
      skipSkipped: {
        type: "boolean"
      }
    },
    additionalProperties: false
  }
];