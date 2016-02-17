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
  var insideTest = false;
  var options = context.options[0] || {};
  var skipSkipped = options.hasOwnProperty("skipSkipped") ? options.skipSkipped : false;
  var nodeSkipped = false;
  var caller = "";

  return {
    "FunctionExpression": function (node) {
      if (n.isTestBody(node)) {
        if (skipSkipped) {
          nodeSkipped = n.tryDetectSkipInParent(node);
        }
        insideTest = true;
        caller = n.getCaller(node.parent);
      }
    },
    "FunctionExpression:exit": function (node) {
      if (n.isTestBody(node)) {
        insideTest = false;
        nodeSkipped = false;
        caller = "";
      }
    },

    "CallExpression": function (node) {
      var callee = obj.get(node, "callee");
      if (callee) {
        var _c = n.cleanCaller(n.getCaller(callee)).split('.').pop();
        if (insideTest && disallowed.indexOf(_c) !== -1 && !nodeSkipped) {
          context.report(node, "`{{name}}` is not allowed to use inside `{{caller}}`.", {name: _c, caller: caller});
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