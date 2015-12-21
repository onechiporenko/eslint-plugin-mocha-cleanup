/**
 * @fileoverview Rule to disallow use empty title in the `describe` and `it`
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

  var toCheck = ['it', 'describe'];

  return {
    "CallExpression": function (node) {
      if (toCheck.indexOf(node.callee.name) !== -1) {
        var firstArgType = node.arguments[0].type;
        if (firstArgType === 'Literal') {
          var title = node.arguments[0].value || '';
          if (!title.trim()) {
            context.report(node, 'Empty title is not allowed for `{{name}}`.', {name: node.callee.name})
          }
        }
      }
    }
  };
};