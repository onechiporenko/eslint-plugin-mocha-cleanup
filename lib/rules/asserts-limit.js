/**
 * @fileoverview Rule to disallow use more than allowed number of assertions
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var insideIt = false;
	var assertCounter = 0;
	var assertLimit = context.options[0] || 3;
	
	function isShould(node) {
		return node.name === "should" && node.parent.type === "MemberExpression" && node.parent.property.name === "should";
	}
	
	function isExpect(node) {
		return node.name === "expect" && node.parent.type === "CallExpression" && node.parent.callee.name === "expect";
	}
	
	function isAssert(node) {
		return node.name === "assert" && node.parent.type === "MemberExpression" && node.parent.object.name === "assert";
	}
	
    return {
		"FunctionExpression": function (node) {
			if (node.parent.callee.name === 'it' && node.parent.arguments[1] === node) {
				insideIt = true;
			}
		},
		"FunctionExpression:exit": function (node) {
			if (node.parent.callee.name === 'it' && node.parent.arguments[1] === node) {
				if (assertCounter > assertLimit) {
					context.report(node, "Too many assertions ({{num}}). Maximum allowed is {{max}}.", {max: assertLimit, num: assertCounter});
				}
				insideIt = false;
				assertCounter = 0;
			}
		},
		"Identifier": function (node) {
			if (isShould(node)) {
				assertCounter++;
			}
			if (isExpect(node)) {
				assertCounter++;
			}
			if (isAssert(node)) {
				assertCounter++;
			}
		}
    };
};