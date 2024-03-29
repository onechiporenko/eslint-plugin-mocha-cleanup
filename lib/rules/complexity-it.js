/**
 * @fileoverview Counts `it`-body complexity
 * Rule based on "default" `complexity`-rule implementation
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

'use strict';

const n = require('../utils/node.js');
const { isSkipSkipped } = require('../utils/options.js');
const { hasOwnProperty } = Object.prototype;

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  // Stryker disable all
  meta: {
    type: 'suggestion',
    schema: [
      {
        type: 'object',
        properties: {
          maxAllowedComplexity: {
            type: 'number',
          },
          skipSkipped: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  // Stryker restore all

  create(context) {
    let insideIt = false;
    let currentComplexityCount = 0;
    const options = context.options[0] || {};
    const maxAllowedComplexity = hasOwnProperty.call(
      options,
      'maxAllowedComplexity'
    )
      ? options.maxAllowedComplexity
      : 40;
    const skipSkipped = isSkipSkipped(options, context);
    let nodeSkipped;

    function increaseComplexity() {
      if (!insideIt) {
        return;
      }
      if (nodeSkipped) {
        return;
      }
      currentComplexityCount++;
    }

    function fEnter(node) {
      if (n.isTestBody(node)) {
        if (skipSkipped) {
          nodeSkipped = n.tryDetectSkipInParent(node);
        }
        insideIt = true;
      }
    }

    function fExit(node) {
      if (n.isTestBody(node)) {
        if (currentComplexityCount > maxAllowedComplexity) {
          context.report(
            node.parent,
            '`{{name}}` has a complexity of {{num}}. Maximum allowed is {{max}}.',
            {
              max: maxAllowedComplexity,
              num: currentComplexityCount,
              name: n.getCaller(node.parent),
            }
          );
        }
        insideIt = false;
        nodeSkipped = false;
        currentComplexityCount = 0;
      }
    }

    return {
      FunctionExpression: fEnter,
      ArrowFunctionExpression: fEnter,
      'FunctionExpression:exit': fExit,
      'ArrowFunctionExpression:exit': fExit,

      MemberExpression(node) {
        if (
          n.isSinonAssert(node) ||
          n.isChaiAssert(node) ||
          n.isChaiShould(node) ||
          n.isChaiChainable(node)
        ) {
          return;
        }
        if (node.parent.type === 'MemberExpression') {
          return;
        }
        increaseComplexity();
      },

      CallExpression(node) {
        if (n.isChaiExpect(node)) {
          return;
        }
        increaseComplexity();
      },

      FunctionDeclaration: increaseComplexity,
      ExpressionStatement: increaseComplexity,
      CatchClause: increaseComplexity,
      ConditionalExpression: increaseComplexity,
      LogicalExpression: increaseComplexity,
      ForStatement: increaseComplexity,
      ForInStatement: increaseComplexity,
      ForOfStatement: increaseComplexity,
      IfStatement: increaseComplexity,
      SwitchCase: increaseComplexity,
      WhileStatement: increaseComplexity,
      DoWhileStatement: increaseComplexity,
    };
  },
};
