/**
 * @fileoverview Rule to disallow usage `eql`, `deep.equal`, `assert.deepEqual`, `assert.notDeepEqual` with primitives
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict";

var n = require("../utils/node.js");
var obj = require("../utils/obj.js");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

  var options = context.options[0] || {};
  var skipSkipped = options.hasOwnProperty("skipSkipped") ? options.skipSkipped : false;
  var strictCheck = ["assert.deepEqual", "assert.notDeepEqual"];
  var notStrictCheck = [".eql", ".deep.equal"];
  var insideTest = false;

  function isPrimitive(arg) {
    var type = obj.getType(arg.value);
    return ["string", "number", "boolean", "null"].indexOf(type) !== -1;
  }

  function fEnter (node) {
    if (n.isTestBody(node)) {
      insideTest = true;
    }
  }

  function fExit (node) {
    if (n.isTestBody(node)) {
      insideTest = false;
    }
  }

  return {
    "FunctionExpression": fEnter,
    "ArrowFunctionExpression": fEnter,
    "FunctionExpression:exit": fExit,
    "ArrowFunctionExpression:exit": fExit,
    "MemberExpression": function (node) {
      if (insideTest && !(skipSkipped && n.tryDetectSkipInParent(node))) {
        var caller = n.getCaller(node);
        if (!caller) {
          return;
        }
        var args;
        // check as assert.*
        if (strictCheck.indexOf(caller) !== -1) {
          args = obj.get(node, "parent.arguments");
          if (args.length > 1 && args[1].type === "Literal") {
            if (isPrimitive(args[1])) {
              context.report(node, "`{{caller}}` should not be used with primitives.", {caller: caller});
            }
          }
          return;
        }

        // check as *.eql
        // Because of chai expect/should logic, MemberExpression may be pretty long.
        // So, there is not no sense to get it full. We just can check if it ends with needed substring
        var toCheck = false;
        var _caller = ""; // used in the report-message
        notStrictCheck.forEach(function (str) {
          if (caller.indexOf(str, caller.length - str.length) !== -1) { // endWith -> `some.eql` ends with `.eql`
            _caller = str;
            toCheck = true;
          }
        });
        if (toCheck) {
          args = obj.get(node, "parent.arguments");
          if (args.length > 0 && args[0].type === "Literal") {
            if (isPrimitive(args[0])) {
              context.report(node, "`{{caller}}` should not be used with primitives.", {caller: _caller});
            }
          }
        }
      }
    }
  }
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