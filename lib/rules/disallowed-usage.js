/**
 * @fileoverview Rule to disallow usage some functions, methods or properties in the tests and hooks
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict";

var n = require("../utils/node.js");
var obj = require("../utils/obj.js");
var isSkipSkipped = require("../utils/options.js").isSkipSkipped;
var hasOwnProperty = Object.prototype.hasOwnProperty;
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function prepareCallers(parts) {
  var ret = [];
  parts.forEach(function (c) {
    if (hasOwnProperty.call(c, "f")) {
      return ret.push(c.f);
    }
    if (hasOwnProperty.call(c, "m") && hasOwnProperty.call(c, "o")) {
      c.m.forEach(function (_m) {
        return ret.push(c.o + "." + _m);
      });
    }
    if (hasOwnProperty.call(c, "p") && hasOwnProperty.call(c, "o")) {
      c.p.forEach(function (_p) {
        ret.push(c.o + "." + _p);
      });
    }
  });
  return ret;
}
function prepareProperties(parts) {
  var ret = [];
  parts.forEach(function (c) {
    if (hasOwnProperty.call(c, "p") && hasOwnProperty.call(c, "o")) {
      c.p.forEach(function (_p) {
        ret.push(c.o + "." + _p);
      });
    }
  });
  return ret;
}

module.exports = {
  create: function (context) {

    var insideTest = false;
    var insideHook = false;
    var options = context.options[0];
    if (!options) {
      return {};
    }
    var skipSkipped = isSkipSkipped(options, context);
    var disallowedMethodsInTests = hasOwnProperty.call(options, "test") ? prepareCallers(options.test) : [];
    var disallowedPropertiesInTests = hasOwnProperty.call(options, "test") ? prepareProperties(options.test) : [];
    var disallowedMethodsInHooks = hasOwnProperty.call(options, "hook") ? prepareCallers(options.hook) : [];
    var disallowedPropertiesInHooks = hasOwnProperty.call(options, "hook") ? prepareProperties(options.hook) : [];

    function detect(flag, disallowed, caller, node) {
      return flag && disallowed.indexOf(caller) !== -1 && !(skipSkipped && n.tryDetectSkipInParent(node));
    }

    function fEnter(node) {
      if (n.isTestBody(node)) {
        insideTest = true;
      }
      if (n.isHookBody(node)) {
        insideHook = true;
      }
    }

    function fExit(node) {
      if (n.isTestBody(node)) {
        insideTest = false;
      }
      if (n.isHookBody(node)) {
        insideHook = false;
      }
    }

    return {
      "FunctionExpression": fEnter,
      "ArrowFunctionExpression": fEnter,
      "FunctionExpression:exit": fExit,
      "ArrowFunctionExpression:exit": fExit,
      "CallExpression": function (node) {
        var parent = obj.get(node, "parent");
        /* istanbul ignore if */
        if (!parent) {
          return;
        }
        var caller = n.cleanCaller(n.getCaller(node));
        /* istanbul ignore if */
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
        /* istanbul ignore if */
        if (!parent) {
          return;
        }
        if (parent.type === "CallExpression" && parent.arguments.indexOf(node) === -1) {
          return;
        }
        var caller = n.cleanCaller(n.getCaller(node));
        if (detect(insideTest, disallowedPropertiesInTests, caller, node)) {
          context.report(node, "`{{caller}}` is not allowed here.", {caller: caller});
        }
        if (detect(insideHook, disallowedPropertiesInHooks, caller, node)) {
          context.report(node, "`{{caller}}` is not allowed here.", {caller: caller});
        }
      }
    };
  },

  meta: {
    type: "suggestion",
    schema: [
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
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "minItems": 1,
                  "uniqueItems": true
                },
                "f": {
                  type: "string"
                },
                "p": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "minItems": 1,
                  "uniqueItems": true
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
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "minItems": 1,
                  "uniqueItems": true
                },
                "f": {
                  type: "string"
                },
                "p": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "minItems": 1,
                  "uniqueItems": true
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
    ]
  }
};
