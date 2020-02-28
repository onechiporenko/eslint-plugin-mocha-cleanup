/**
 * @fileoverview Rule to disallow usage some functions, methods or properties in the tests and hooks
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict"

const n = require("../utils/node.js")
const obj = require("../utils/obj.js")
const { isSkipSkipped } = require("../utils/options.js")
const { hasOwnProperty } = Object.prototype
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function prepareCallers (parts) {
  const ret = []
  parts.forEach(function (c) {
    if (hasOwnProperty.call(c, "f")) {
      return ret.push(c.f)
    }
    if (hasOwnProperty.call(c, "m") && hasOwnProperty.call(c, "o")) {
      c.m.forEach(function (_m) {
        return ret.push(c.o + "." + _m)
      })
    }
    if (hasOwnProperty.call(c, "p") && hasOwnProperty.call(c, "o")) {
      c.p.forEach(function (_p) {
        ret.push(c.o + "." + _p)
      })
    }
  })
  return ret
}
function prepareProperties (parts) {
  const ret = []
  parts.forEach(function (c) {
    if (hasOwnProperty.call(c, "p") && hasOwnProperty.call(c, "o")) {
      c.p.forEach(function (_p) {
        ret.push(c.o + "." + _p)
      })
    }
  })
  return ret
}

module.exports = {
  create (context) {
    let insideTest = false
    let insideHook = false
    const [options] = context.options
    if (!options) {
      return {}
    }
    const skipSkipped = isSkipSkipped(options, context)
    const disallowedMethodsInTests = hasOwnProperty.call(options, "test") ? prepareCallers(options.test) : []
    const disallowedPropertiesInTests = hasOwnProperty.call(options, "test") ? prepareProperties(options.test) : []
    const disallowedMethodsInHooks = hasOwnProperty.call(options, "hook") ? prepareCallers(options.hook) : []
    const disallowedPropertiesInHooks = hasOwnProperty.call(options, "hook") ? prepareProperties(options.hook) : []

    function detect (flag, disallowed, caller, node) {
      return flag && disallowed.indexOf(caller) !== -1 && !(skipSkipped && n.tryDetectSkipInParent(node))
    }

    function fEnter (node) {
      if (n.isTestBody(node)) {
        insideTest = true
      }
      if (n.isHookBody(node)) {
        insideHook = true
      }
    }

    function fExit (node) {
      if (n.isTestBody(node)) {
        insideTest = false
      }
      if (n.isHookBody(node)) {
        insideHook = false
      }
    }

    return {
      FunctionExpression: fEnter,
      ArrowFunctionExpression: fEnter,
      "FunctionExpression:exit": fExit,
      "ArrowFunctionExpression:exit": fExit,
      CallExpression (node) {
        const parent = obj.get(node, "parent")
        /* istanbul ignore if */
        if (!parent) {
          return
        }
        const caller = n.cleanCaller(n.getCaller(node))
        /* istanbul ignore if */
        if (!caller) {
          return
        }
        if (detect(insideTest, disallowedMethodsInTests, caller, node)) {
          context.report(node, "`{{caller}}` is not allowed here.", { caller })
        }
        if (detect(insideHook, disallowedMethodsInHooks, caller, node)) {
          context.report(node, "`{{caller}}` is not allowed here.", { caller })
        }
      },
      MemberExpression (node) {
        const parent = obj.get(node, "parent")
        /* istanbul ignore if */
        if (!parent) {
          return
        }
        if (parent.type === "CallExpression" && parent.arguments.indexOf(node) === -1) {
          return
        }
        const caller = n.cleanCaller(n.getCaller(node))
        if (detect(insideTest, disallowedPropertiesInTests, caller, node)) {
          context.report(node, "`{{caller}}` is not allowed here.", { caller })
        }
        if (detect(insideHook, disallowedPropertiesInHooks, caller, node)) {
          context.report(node, "`{{caller}}` is not allowed here.", { caller })
        }
      }
    }
  },

  meta: {
    type: "suggestion",
    schema: [
      {
        type: "object",
        properties: {
          hook: {
            type: "array",
            item: {
              type: "object",
              properties: {
                o: {
                  type: "string"
                },
                m: {
                  type: "array",
                  items: {
                    type: "string"
                  },
                  minItems: 1,
                  uniqueItems: true
                },
                f: {
                  type: "string"
                },
                p: {
                  type: "array",
                  items: {
                    type: "string"
                  },
                  minItems: 1,
                  uniqueItems: true
                }
              }
            }
          },
          test: {
            type: "array",
            item: {
              properties: {
                o: {
                  type: "string"
                },
                m: {
                  type: "array",
                  items: {
                    type: "string"
                  },
                  minItems: 1,
                  uniqueItems: true
                },
                f: {
                  type: "string"
                },
                p: {
                  type: "array",
                  items: {
                    type: "string"
                  },
                  minItems: 1,
                  uniqueItems: true
                }
              }
            }
          },
          skipSkipped: {
            type: "boolean"
          }
        },
        additionalProperties: false
      }
    ]
  }
}
