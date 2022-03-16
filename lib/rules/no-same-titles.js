/**
 * @fileoverview Rule to disallow usage same titles for `it`s inside one `describe` or in the whole file. It depends on `scope` value - may be `file` or `suite`. Default - `suite`
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

'use strict';

const obj = require('../utils/obj.js');
const n = require('../utils/node.js');
const mocha = require('../utils/mocha-specs.js');
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
          scope: {
            enum: ['suite', 'file'],
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
    let insideSuite = false;
    const testTitles = [];
    const options = context.options[0] || {};
    const skipSkipped = isSkipSkipped(options, context);
    const scope = hasOwnProperty.call(options, 'scope')
      ? options.scope
      : 'suite';
    const checkNesting = scope === 'suite';
    let nestingLevel = checkNesting ? -1 : 0;

    function report(level) {
      Object.keys(testTitles[level]).forEach(function (title) {
        if (testTitles[level][title].length > 1) {
          testTitles[level][title].forEach(function (node) {
            context.report(node, 'Some tests have same titles.');
          });
        }
      });
    }

    function fEnter(node) {
      if (
        n.isSuiteBody(node) &&
        !(skipSkipped && n.tryDetectSkipInParent(node))
      ) {
        insideSuite = true;
        if (checkNesting) {
          nestingLevel++;
        }
        if (!testTitles[nestingLevel]) {
          testTitles[nestingLevel] = {};
        }
      }
    }

    function fExit(node) {
      if (
        n.isSuiteBody(node) &&
        !(skipSkipped && n.tryDetectSkipInParent(node))
      ) {
        insideSuite = false;
        if (checkNesting) {
          report(nestingLevel);
          testTitles[nestingLevel] = {};
          nestingLevel--;
        }
      }
    }

    return {
      FunctionExpression: fEnter,
      ArrowFunctionExpression: fEnter,
      'FunctionExpression:exit': fExit,
      'ArrowFunctionExpression:exit': fExit,
      CallExpression(node) {
        if (
          insideSuite &&
          !(skipSkipped && n.tryDetectSkipInParent(node)) &&
          mocha.tests.includes(obj.get(node, 'callee.name'))
        ) {
          const firstArgType = obj.get(node, 'arguments.0.type');
          if (firstArgType === 'Literal') {
            const title = obj.get(node, 'arguments.0.value');
            if (!Array.isArray(testTitles[nestingLevel][title])) {
              // title = "constructor" may break `!testTitles[nestingLevel][title]`
              testTitles[nestingLevel][title] = [];
            }
            testTitles[nestingLevel][title].push(node);
          }
        }
      },
      'Program:exit'() {
        if (checkNesting) {
          return;
        }
        testTitles.forEach(function (level) {
          Object.keys(level).forEach(function (title) {
            if (level[title].length > 1) {
              level[title].forEach(function (node) {
                context.report(node, 'Some tests have same titles.');
              });
            }
          });
        });
      },
    };
  },
};
