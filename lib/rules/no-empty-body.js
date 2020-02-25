/**
 * @fileoverview Rule to disallow use empty tests, suites and hooks
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict";

var n = require("../utils/node.js");
var obj = require("../utils/obj.js");
var mocha = require("../utils/mocha-specs.js");
var hasOwnProperty = Object.prototype.hasOwnProperty;
var toCheck = mocha.all.concat(mocha.hooks);

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {
  var options = context.options[0] || {};
  var skipSkipped = hasOwnProperty.call(options, "skipSkipped") ? options.skipSkipped : false;

  function fEnter (node) {
    if (skipSkipped && n.tryDetectSkipInParent(node)) {
      return;
    }
    var caller = n.getCaller(node.parent);
    if (toCheck.indexOf(caller) !== -1) {
      if (!obj.get(node, "body.body.length")) {
        context.report(node, "Empty function is not allowed here.");
      }
    }
  }

  return {
    "FunctionExpression": fEnter,
    "ArrowFunctionExpression": fEnter
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