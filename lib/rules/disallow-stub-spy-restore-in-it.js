/**
 * @fileoverview Rule to disallow usage `stub/spy/restore` in the `it`
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var disallowed = ['stub', 'spy', 'restore'];
	var insideIt = false;
	
    return {
        "FunctionExpression": function(node) {
            if (node.parent.callee.name === 'it' && node.parent.arguments[1] === node) {
				insideIt = true;
			}
        },
		"FunctionExpression:exit": function(node) {
            if (node.parent.callee.name === 'it' && node.parent.arguments[1] === node) {
				insideIt = false;
			}
        },
		"Identifier": function (node) {
			if (node.parent.type !== "MemberExpression") {
				return;
			}
			if (node.parent.property.name !== node.name) {
				return;
			}
			if (insideIt && disallowed.indexOf(node.name) !== -1) {
				context.report(node, "`{{name}}` is not allowed to use inside `it`.", {name: node.name});
			}
		}
    };
};