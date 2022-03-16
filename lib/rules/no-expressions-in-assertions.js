/**
 * @fileoverview Rule to detect expressions in the `expect` and `assert` assertions
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

'use strict';

const n = require('../utils/node.js');
const obj = require('../utils/obj.js');
const { isSkipSkipped } = require('../utils/options.js');
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
          skipSkipped: {
            type: 'boolean',
          },
          replacementsOnly: {
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
    const options = context.options[0] || {};
    const skipSkipped = isSkipSkipped(options, context);
    let nodeSkipped;
    const { replacementsOnly } = options;

    const defaultMessage = 'Expression should not be used here.';
    const detailedMessage = '`{{shouldUse}}` should be used.';
    const emptyArgMessage = 'Empty assertion is not allowed.';

    const typesToReportAsDefault = [
      'ConditionalExpression',
      'UnaryExpression',
      'LogicalExpression',
      'UpdateExpression',
    ];

    const binaryMapForExpect = {
      '===': '.to.be.equal',
      '!==': '.to.be.not.equal',
      '==': '.to.be.equal',
      '!=': '.to.be.not.equal',
      '>=': '.to.be.at.least',
      '>': '.to.be.above',
      '<=': '.to.be.most',
      '<': '.to.be.below',
      instanceof: '.to.be.instanceof',
    };

    const binaryMapForAssert = {
      '===': '.strictEqual',
      '!==': '.notStrictEqual',
      '==': '.equal',
      '!=': '.notEqual',
      '>=': '.isAtLeast',
      '>': '.isAbove',
      '<=': '.isAtMost',
      '<': '.isBelow',
    };

    /**
     *
     * @param {ASTNode} binaryExpression
     * @param {ASTNode} node
     * @returns {*}
     */
    function checkBinaryInExpect(binaryExpression, node) {
      const eqls = ['===', '==', '!==', '!='];
      const op = binaryExpression.operator;
      const shouldUse = binaryMapForExpect[op];
      if (shouldUse) {
        if (!eqls.includes(op)) {
          return context.report(node, detailedMessage, { shouldUse });
        }
        const primitives = [null, true, false];
        for (let i = 0; i < primitives.length; i++) {
          if (
            checkForValueInExpect(binaryExpression, op, node, primitives[i])
          ) {
            return;
          }
        }

        if (checkForUndefinedInExpect(binaryExpression, op, node)) {
          return;
        }
        return context.report(node, detailedMessage, { shouldUse });
      }
      if (!replacementsOnly) {
        return context.report(node, defaultMessage);
      }
    }

    /**
     *
     * @param {ASTNode} binaryExpression
     * @param {string} op '=='|'==='|'!='|'!=='
     * @param {ASTNode} node
     * @param {*} value
     * @returns {boolean}
     */
    function checkForValueInExpect(binaryExpression, op, node, value) {
      const shouldUse = '.to.' + (op[0] === '!' ? 'not.' : '') + 'be.' + value;
      if (
        obj.get(binaryExpression, 'left.value') === value ||
        obj.get(binaryExpression, 'right.value') === value
      ) {
        context.report(node, detailedMessage, { shouldUse });
        return true;
      }
      return false;
    }

    /**
     *
     * @param {ASTNode} binaryExpression
     * @param {string} op '=='|'==='|'!='|'!=='
     * @param {ASTNode} node
     * @returns {boolean}
     */
    function checkForUndefinedInExpect(binaryExpression, op, node) {
      const shouldUse = '.to.' + (op[0] === '!' ? 'not.' : '') + 'be.undefined';
      if (
        obj.get(binaryExpression, 'left.name') === 'undefined' ||
        obj.get(binaryExpression, 'right.name') === 'undefined'
      ) {
        context.report(node, detailedMessage, { shouldUse });
        return true;
      }
      return false;
    }

    /**
     *
     * @param {ASTNode} binaryExpression
     * @param {ASTNode} node
     */
    function checkBinaryInAssert(binaryExpression, node) {
      const eqls = ['===', '==', '!==', '!='];
      const op = binaryExpression.operator;
      const shouldUse = binaryMapForAssert[op];
      if (shouldUse) {
        if (!eqls.includes(op)) {
          return context.report(node, detailedMessage, { shouldUse });
        }
        const primitives = [null, true, false];
        for (let i = 0; i < primitives.length; i++) {
          if (checkForValueAssert(binaryExpression, op, node, primitives[i])) {
            return;
          }
        }

        if (checkForUndefinedAssert(binaryExpression, op, node)) {
          return;
        }
        return context.report(node, detailedMessage, { shouldUse });
      }
      if (!replacementsOnly) {
        return context.report(node, defaultMessage);
      }
    }

    /**
     *
     * @param {ASTNode} binaryExpression
     * @param {string} op '=='|'==='|'!='|'!=='
     * @param {ASTNode} node
     * @param {*} value
     * @returns {boolean}
     */
    function checkForValueAssert(binaryExpression, op, node, value) {
      const _value = '' + value;
      const shouldUse =
        '.is' +
        (op[0] === '!' ? 'Not' : '') +
        _value.charAt(0).toUpperCase() +
        _value.slice(1);
      if (
        obj.get(binaryExpression, 'left.value') === value ||
        obj.get(binaryExpression, 'right.value') === value
      ) {
        context.report(node, detailedMessage, { shouldUse });
        return true;
      }
      return false;
    }

    /**
     *
     * @param {ASTNode} binaryExpression
     * @param {string} op '=='|'==='|'!='|'!=='
     * @param {ASTNode} node
     * @returns {boolean}
     */
    function checkForUndefinedAssert(binaryExpression, op, node) {
      const shouldUse = op[0] === '!' ? '.isDefined' : '.isUndefined';
      if (
        obj.get(binaryExpression, 'left.name') === 'undefined' ||
        obj.get(binaryExpression, 'right.name') === 'undefined'
      ) {
        context.report(node, detailedMessage, { shouldUse });
        return true;
      }
      return false;
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
        insideIt = false;
        nodeSkipped = false;
      }
    }

    function dontReport(arg) {
      return replacementsOnly || arg.operator === 'typeof';
    }

    return {
      FunctionExpression: fEnter,
      ArrowFunctionExpression: fEnter,
      'FunctionExpression:exit': fExit,
      'ArrowFunctionExpression:exit': fExit,
      CallExpression(node) {
        if (!insideIt || nodeSkipped) {
          return;
        }
        let arg;
        const isChaiExpect = n.isChaiExpect(node);
        const isChaiAssert = n.isChaiAssert(node);
        if (isChaiAssert) {
          arg = obj.get(node, 'arguments.0');
          if (!arg) {
            return context.report(node, emptyArgMessage);
          }
          if (arg.type === 'BinaryExpression') {
            return checkBinaryInAssert(arg, node);
          }
          if (typesToReportAsDefault.includes(arg.type) && !dontReport(arg)) {
            return context.report(node, defaultMessage);
          }
        }
        if (isChaiExpect) {
          arg = obj.get(node, 'arguments.0');
          if (!arg) {
            return context.report(node, emptyArgMessage);
          }
          if (arg.type === 'BinaryExpression') {
            return checkBinaryInExpect(arg, node);
          }
          if (typesToReportAsDefault.includes(arg.type) && !dontReport(arg)) {
            return context.report(node, defaultMessage);
          }
        }
      },
      MemberExpression(node) {
        if (!insideIt || nodeSkipped) {
          return;
        }
        let arg;
        if (n.isChaiAssert(node)) {
          arg = obj.get(node, 'parent.arguments.0');
          if (!arg) {
            return context.report(node, emptyArgMessage);
          }
          if (arg.type === 'BinaryExpression') {
            return checkBinaryInAssert(arg, node);
          }
          if (typesToReportAsDefault.includes(arg.type) && !dontReport(arg)) {
            return context.report(node, defaultMessage);
          }
        }
      },
    };
  },
};
