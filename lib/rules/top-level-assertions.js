/**
 * @fileoverview Rule to check deep placed assertion
 * @author onechiporenko
 * @copyright 2022 onechiporenko. All rights reserved.
 */

'use strict';

const n = require('../utils/node.js');
const { isSkipSkipped } = require('../utils/options.js');
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    schema: [
      {
        type: 'object',
        properties: {
          skipSkipped: {
            type: 'boolean',
          },
          assertionsCheckExpression: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    let insideIt = false;
    let lastTestNode = null;
    const options = context.options[0] || {};
    const skipSkipped = isSkipSkipped(options, context);
    let nodesToReport = [];
    const assertionsCheckExpression = options.assertionsCheckExpression
      ? options.assertionsCheckExpression
      : false;
    let assertionsCheckExists = false;

    const message =
      "This assertion is deeply nested. Are you sure it's called?";

    function check(node) {
      if (!insideIt) {
        return;
      }
      if (
        n.isAssertion(node) &&
        !(skipSkipped && n.tryDetectSkipInParent(node))
      ) {
        const parentExpression = n.getParentExpression(node);
        if (!parentExpression) {
          return;
        }
        const parentNode = parentExpression.parent;
        const parentParentNode = parentNode && parentNode.parent;
        if (
          !!lastTestNode &&
          parentNode !== lastTestNode &&
          parentParentNode !== lastTestNode
        ) {
          nodesToReport.push(node);
        }
      }
    }

    function fEnter(node) {
      if (n.isTestBody(node)) {
        const nodeSourceCode = context.getSourceCode().getText(node);
        if (assertionsCheckExpression) {
          assertionsCheckExists = RegExp(assertionsCheckExpression, 'gm').test(
            nodeSourceCode
          );
        }
        insideIt = true;
        lastTestNode = node;
      }
    }

    function fExit(node) {
      if (n.isTestBody(node)) {
        insideIt = false;
        lastTestNode = null;
        if (nodesToReport.length && !assertionsCheckExists) {
          nodesToReport.forEach((node) => context.report(node, message));
        }
        nodesToReport = [];
        assertionsCheckExists = false;
      }
    }

    return {
      FunctionExpression: fEnter,
      ArrowFunctionExpression: fEnter,
      'FunctionExpression:exit': fExit,
      'ArrowFunctionExpression:exit': fExit,
      MemberExpression: check,
      CallExpression: check,
    };
  },
};
