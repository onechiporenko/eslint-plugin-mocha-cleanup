/**
 * @fileoverview Rule to disallow use empty title in the `describe` and `it`
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

  var toCheck = ["it", "describe"];
  var skipSkipped = context.options.length >= 1 ? context.options[0] : false;

  return {
    "CallExpression": function (node) {
      var callee = obj.get(node, "callee");
      var o;
      if (!callee) {
        return;
      }
      if (callee.type === "MemberExpression") {
        o = obj.get(node, "callee.object.name");
        var p = obj.get(node, "callee.object.property");
        if (toCheck.indexOf(o) !== -1) {
          if (p !== "skip" && !(skipSkipped && n.tryDetectSkipInParent(node))) {
            firstArgType = obj.get(node, "arguments.0.type");
            if (firstArgType === "Literal") {
              title = obj.get(node, "arguments.0.value") || "";
              if (!title.trim()) {
                context.report(node, "Empty title is not allowed for `{{name}}`.", {name: o});
              }
            }
          }
        }
      }
      else {
        o = obj.get(node, "callee.name");
        if (toCheck.indexOf(o) !== -1) {
          var firstArgType = obj.get(node, "arguments.0.type");
          if (firstArgType === "Literal") {
            var title = obj.get(node, "arguments.0.value") || "";
            if (!title.trim()) {
              context.report(node, "Empty title is not allowed for `{{name}}`.", {name: o});
            }
          }
        }
      }
    }

  };
};