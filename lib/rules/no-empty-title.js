/**
 * @fileoverview Rule to disallow use empty title in the `describe` and `it`
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

  var options = context.options[0] || {};
  var skipSkipped = options.hasOwnProperty("skipSkipped") ? options.skipSkipped : false;

  return {
    "CallExpression": function (node) {
      var caller = n.getCaller(node);
      if (!caller || mocha.all.indexOf(caller) === -1) {
        return;
      }
      if (skipSkipped && (mocha.allSkipped.indexOf(caller) !== -1 || n.tryDetectSkipInParent(node))) {
        return;
      }

      var firstArgType = obj.get(node, "arguments.0.type");
      if (firstArgType === "Literal") {
        var title = "" + obj.get(node, "arguments.0.value") || "";
        if (!title.trim()) {
          context.report(node, "Empty title is not allowed for `{{name}}`.", {name: caller});
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