"use strict"

const obj = require("./obj.js")

const mocha = require("./mocha-specs.js")

const chainable = ["to", "be", "been", "is", "that", "which", "and", "has", "have", "with", "at", "of", "same"]

/**
 * @typedef {object} ASTNode
 */

/**
 * Detect `MemberExpression` as `sinon.assert.someFunc(...)` or `sinon['assert'].someFunc(...)`
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isSinonAssert (node) {
  return node.type === "MemberExpression" &&
    node.object.name === "sinon" &&
    (node.property.name === "assert" || node.property.value === "assert")
}

/**
 * Detect `MemberExpression` as `someVal.should` or `someVal['should']`
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isChaiShould (node) {
  return node.type === "MemberExpression" &&
    (node.property.name === "should" || node.property.value === "should")
}

/**
 * Detect `MemberExpression` as 'chainable getters'
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isChaiChainable (node) {
  return node.type === "MemberExpression" &&
    chainable.includes(node.property.name)
}

/**
 * Detect `CallExpression` as `expect(...).to` or `chai.expect(...).to` or `chai['expect'](...).to`
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isChaiExpect (node) {
  const { callee } = node
  return node.type === "CallExpression" &&
    (
      callee.name === "expect" ||
      (obj.get(callee, "object.name") === "chai" &&
      (callee.property.name === "expect" || callee.property.value === "expect"))
    )
}

/**
 * Detect `CallExpression` as `assert.equal(...)`
 *
 * @param {ASTNode} node
 * @returns {boolean}
 * @private
 */
function _isChaiAssert1 (node) {
  return node.type === "MemberExpression" && obj.get(node, "parent.type") === "CallExpression" && node.object.name === "assert"
}

/**
 * Detect `CallExpression` as `assert(...)`
 *
 * @param {ASTNode} node
 * @returns {boolean}
 * @private
 */
function _isChaiAssert2 (node) {
  return node.type === "CallExpression" && node.callee.name === "assert"
}

/**
 * Detect `CallExpression` as `chai.assert(...)` or `chai['assert'](...)`
 *
 * @param {ASTNode} node
 * @returns {boolean}
 * @private
 */
function _isChaiAssert3 (node) {
  return node.type === "MemberExpression" &&
    obj.get(node, "parent.type") === "CallExpression" &&
    node.object.name === "chai" &&
    (node.property.name === "assert" || node.property.value === "assert")
}

/**
 * Detect `CallExpression` as `chai.assert.equal(...)` or `chai.assert['equal'](...)` or `chai['assert'].equal(...)` or `chai['assert']['equal'](...)`
 *
 * @param {ASTNode} node
 * @returns {boolean}
 * @private
 */
function _isChaiAssert4 (node) {
  return node.type === "MemberExpression" &&
    obj.get(node, "parent.type") === "CallExpression" &&
    node.object.type === "MemberExpression" &&
    node.object.object.name === "chai" &&
    (node.object.property.name === "assert" || node.object.property.value === "assert")
}

/**
 * Detect Chai Assert
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isChaiAssert (node) {
  return _isChaiAssert1(node) || _isChaiAssert2(node) || _isChaiAssert3(node) || _isChaiAssert4(node)
}

/**
 * Detect suite or test 'body'
 * Also can detect skipped suites and tests
 *
 * @param {ASTNode} node
 * @param {string} type
 * @returns {boolean}
 */
function isBlockBody (node, type) {
  /* istanbul ignore next */
  const types = Array.isArray(type) ? type : [type]
  const { parent } = node
  if (!parent) {
    return false
  }
  const parentType = obj.get(parent, "callee.object") ? "MemberExpression" : "Identifier"
  if (parentType === "MemberExpression") {
    return types.includes(parent.callee.object.name + "." + parent.callee.property.name) && obj.get(parent, "arguments.1") === node
  }
  /* istanbul ignore else */
  if (parentType === "Identifier") {
    return types.includes(obj.get(parent, "callee.name")) && (obj.get(parent, "arguments.0") === node || obj.get(parent, "arguments.1") === node)
  }

  /* istanbul ignore next */
  return false
}

/**
 * Detect if `node` is 'test'-node and it is skipped (`it.skip` or `describe.skip`)
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isTestSkipped (node) {
  if (node.type !== "CallExpression") {
    return false
  }
  const { callee } = node
  if (callee.type === "Identifier") {
    return mocha.allSkipped.includes(callee.name)
  }
  const o = callee.object.name
  if (!mocha.allBlocks.includes(o)) {
    return false
  }
  const prop = callee.property.name
  return mocha.allSkipped.includes(o + "." + prop)
}

/**
 * Try to detect if `node` is in the skipped test
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function tryDetectSkipInParent (node) {
  let n = node
  while (n) {
    if (isTestSkipped(n)) {
      return true
    }
    n = n.parent
  }
  return false
}

/**
 * Detect if `node` is `suite`-body
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isSuiteBody (node) {
  return isBlockBody(node, mocha.allSuites)
}

/**
 * Detect if `node` is `test`-body
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isTestBody (node) {
  return isBlockBody(node, mocha.allTests)
}

/**
 * Determines if `node` is `hook`-body
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isHookBody (node) {
  return isBlockBody(node, mocha.hooks)
}

/**
 * Detect if `node is assertion (Chai or Sinon)
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isAssertion (node) {
  return isChaiShould(node) || isChaiExpect(node) || isChaiAssert(node) || isSinonAssert(node)
}

/**
 * Get "full" callee-name, like `describe.skip`, `xit` etc
 *
 * @param {ASTNode} node
 * @returns {string}
 */
function getCaller (node) {
  let o, p
  if (obj.get(node, "type") === "MemberExpression") {
    o = node.object.type === "MemberExpression" ? getCaller(node.object) : node.object.name
    p = node.property.name || node.property.value
    return p ? o + "." + p : o
  }
  const { callee } = node
  if (!callee) {
    return ""
  }
  if (callee.type === "MemberExpression") {
    o = callee.object.type === "MemberExpression" ? getCaller(callee.object) : callee.object.name
    p = callee.property.name || callee.property.value
    return p ? o + "." + p : o
  }
  return obj.get(callee, "name")
}

function _endsWith (str, suffix) {
  return str.includes(suffix, str.length - suffix.length)
}

/**
 * Remove `.call` and `.apply` from the end of the string
 *
 * @param {string} caller
 * @returns {string}
 */
function cleanCaller (caller) {
  if (!caller) {
    return ""
  }
  [".call", ".apply"].forEach(function (e) {
    if (_endsWith(caller, e)) {
      const i = caller.lastIndexOf(e)
      caller = caller.substr(0, i)
    }
  })
  return caller
}

/**
 * Return parent "ExpressionStatement" for node if it exists
 * Return `null` otherwise
 *
 * @param {ASTNode} node
 * @returns {ASTNode}
 */
function getParentExpression (node) {
  return _getParentByTypes(node, "ExpressionStatement")
}

/**
 *
 * @param {ASTNode} node
 * @param {string|string[]} types
 * @returns {?ASTNode}
 * @private
 */
function _getParentByTypes (node, types) {
  const _types = Array.isArray(types) ? types : [types]
  if (_types.includes(node.type)) {
    return node
  }
  return node.parent ? _getParentByTypes(node.parent, _types) : null
}

function isSinonStub (node) {
  const caller = cleanCaller(getCaller(node))
  return caller === "stub" || caller === "sinon.stub"
}

module.exports = {

  chaiChainable: chainable,

  isChaiShould,
  isChaiExpect,
  isChaiAssert,
  isSinonAssert,

  isTestBody,
  isSuiteBody,
  isHookBody,

  isAssertion,

  isChaiChainable,

  isSinonStub,

  tryDetectSkipInParent,

  getCaller,
  cleanCaller,

  getParentExpression

}
