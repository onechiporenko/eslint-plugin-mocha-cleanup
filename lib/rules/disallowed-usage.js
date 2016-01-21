/**
 * @fileoverview Rule to disallow usage some functions, methods or properties in the tests and hooks
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict";

var n = require("../utils/node.js");
var obj = require("../utils/obj.js");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function prepareCallers(parts) {
  var ret = [];
  parts.forEach(function (c) {
    if (c.hasOwnProperty("f")) {
      return ret.push(c.f);
    }
    if (c.hasOwnProperty("m") && c.hasOwnProperty("o")) {
      return ret.push(c.o + "." + c.m);
    }
    if (c.hasOwnProperty("p") && c.hasOwnProperty("o")) {
      return ret.push(c.o + "." + c.p);
    }
  });
  return ret;
}
function prepareProperties(parts) {
  var ret = [];
  parts.forEach(function (c) {
    if (c.hasOwnProperty("p") && c.hasOwnProperty("o")) {
      return ret.push(c.o + "." + c.p);
    }
  });
  return ret;
}

module.exports = function (context) {

  var insideTest = false;
  var insideHook = false;
  var options = context.options[0] || {};
  var skipSkipped = options.hasOwnProperty("skipSkipped") ? options.skipSkipped : false;
  var disallowedMethodsInTests = options.hasOwnProperty("test") ? prepareCallers(options.test) : [];
  var disallowedPropertiesInTests = options.hasOwnProperty("test") ? prepareProperties(options.test) : [];
  var disallowedMethodsInHooks = options.hasOwnProperty("hook") ? prepareCallers(options.hook) : [];
  var disallowedPropertiesInHooks = options.hasOwnProperty("hook") ? prepareProperties(options.hook) : [];

  function detect(flag, disallowed, caller, node) {
    return flag && disallowed.indexOf(caller) !== -1 && !(skipSkipped && n.tryDetectSkipInParent(node));
  }

  return {
    "FunctionExpression": function (node) {
      if (n.isTestBody(node)) {
        insideTest = true;
      }
      if (n.isHookBody(node)) {
        insideHook = true;
      }
    },
    "FunctionExpression:exit": function (node) {
      if (n.isTestBody(node)) {
        insideTest = false;
      }
      if (n.isHookBody(node)) {
        insideHook = false;
      }
    },
    "CallExpression": function (node) {
      var parent = obj.get(node, "parent");
      if (!parent) {
        return;
      }
      var caller = n.getCaller(node);
      if (!caller) {
        return;
      }
      if (detect(insideTest, disallowedMethodsInTests, caller, node)) {
        context.report(node, "`{{caller}}` is not allowed here.", {caller: caller});
      }
      if (detect(insideHook, disallowedMethodsInHooks, caller, node)) {
        context.report(node, "`{{caller}}` is not allowed here.", {caller: caller});
      }
    },
    "MemberExpression": function (node) {
      var parent = obj.get(node, "parent");
      if (!parent) {
        return;
      }
      if (parent.type === "CallExpression" && parent.arguments.indexOf(node) === -1) {
        return;
      }
      var caller = n.getCaller(node);
      if (detect(insideTest, disallowedPropertiesInTests, caller, node)) {
        context.report(node, "`{{caller}}` is not allowed here.", {caller: caller});
      }
      if (detect(insideHook, disallowedPropertiesInHooks, caller, node)) {
        context.report(node, "`{{caller}}` is not allowed here.", {caller: caller});
      }
    }
  };
};

module.exports.schema = [
  {
    type: "object",
    properties: {
      hook: {
        type: "array",
        item: {
          type: "object",
          properties: {
            "o": {
              type: "string"
            },
            "m": {
              type: "string"
            },
            "f": {
              type: "string"
            },
            "p": {
              type: "string"
            }
          }
        }
      },
      test: {
        type: "array",
        item: {
          properties: {
            "o": {
              type: "string"
            },
            "m": {
              type: "string"
            },
            "f": {
              type: "string"
            },
            "p": {
              type: "string"
            }
          }
        }
      },
      skipSkipped: {
        type: "boolean"
      }
    },
    additionalProperties: false
  }
];