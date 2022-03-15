/**
 * @fileoverview Rule to disallow usage `eql`, `deep.equal`, `assert.deepEqual`, `assert.notDeepEqual` with primitives
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
  meta: {
    type: 'suggestion',
    schema: [
      {
        type: 'object',
        properties: {
          skipSkipped: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const skipSkipped = isSkipSkipped(options, context);
    const strictCheck = ['assert.deepEqual', 'assert.notDeepEqual'];
    const notStrictCheck = ['.eql', '.deep.equal'];
    let insideTest = false;

    function isPrimitive(arg) {
      const type = obj.getType(arg.value);
      return ['string', 'number', 'boolean', 'null'].includes(type);
    }

    function fEnter(node) {
      if (n.isTestBody(node)) {
        insideTest = true;
      }
    }

    function fExit(node) {
      if (n.isTestBody(node)) {
        insideTest = false;
      }
    }

    return {
      FunctionExpression: fEnter,
      ArrowFunctionExpression: fEnter,
      'FunctionExpression:exit': fExit,
      'ArrowFunctionExpression:exit': fExit,
      MemberExpression(node) {
        if (insideTest && !(skipSkipped && n.tryDetectSkipInParent(node))) {
          const caller = n.getCaller(node);
          /* istanbul ignore if */
          if (!caller) {
            return;
          }
          let args;
          // check as assert.*
          if (strictCheck.includes(caller)) {
            args = obj.get(node, 'parent.arguments');
            if (args.length > 1 && args[1].type === 'Literal') {
              if (isPrimitive(args[1])) {
                context.report(
                  node,
                  '`{{caller}}` should not be used with primitives.',
                  { caller }
                );
              }
            }
            return;
          }

          // check as *.eql
          // Because of chai expect/should logic, MemberExpression may be pretty long.
          // So, there is no sense to get it full. We just can check if it ends with needed substring
          let toCheck = false;
          let _caller = ''; // used in the report-message
          notStrictCheck.forEach(function (str) {
            if (caller.includes(str, caller.length - str.length)) {
              // endWith -> `some.eql` ends with `.eql`
              _caller = str;
              toCheck = true;
            }
          });
          if (toCheck) {
            args = obj.get(node, 'parent.arguments');
            if (args.length > 0 && args[0].type === 'Literal') {
              if (isPrimitive(args[0])) {
                context.report(
                  node,
                  '`{{caller}}` should not be used with primitives.',
                  { caller: _caller }
                );
              }
            }
          }
        }
      },
    };
  },
};
