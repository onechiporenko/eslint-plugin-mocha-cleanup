/**
 * @fileoverview Rule to disallow stubbing some `window`-methods
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict";

var n = require("../utils/node.js");
var obj = require("../utils/obj.js");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  create: function (context) {

    var m = "`sinon.stub` should not be used for `window.{{methodName}}`";

    var options = context.options[0] || {};
    var methods = options.methods;

    return {
      "CallExpression": function (node) {
        if (!n.isSinonStub(node)) {
          return;
        }
        if (obj.get(node, "arguments.0.name") !== "window") {
          return;
        }
        var methodName = obj.get(node, "arguments.1.value");
        if (methods.indexOf(methodName) !== -1) {
          context.report(node, m, {methodName: methodName});
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
          methods: {
            type: "array",
            items: {
              type: "string"
            },
            minItems: 1,
            uniqueItems: true
          }
        },
        requiredProperties: ["methods"],
        additionalProperties: false
      }
    ]
  }
};
