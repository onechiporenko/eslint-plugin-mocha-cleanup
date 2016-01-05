var obj = require("./obj.js");

var tests = ["describe", "it"];

var chainable = ["to", "be", "been", "is", "that", "which", "and", "has", "have", "with", "at", "of", "same"];

/**
 * Detect `Identifier` as part of `sinon.assert.someFunc(...)`
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isParentSinonAssert(node) {
  return obj.get(node, "parent.object.object.name") === "sinon" && obj.get(node, "parent.object.property.name") === "assert";
}

/**
 * Detect `MemberExpression` as `sinon.assert.someFunc(...)`
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isSinonAssert(node) {
  return node.type === "MemberExpression" && obj.get(node, "object.name") === "sinon" && obj.get(node, "property.name") === "assert";
}

/**
 * Detect `Identifier` as part of `someVal.should`
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isParentShould(node) {
  return node.name === "should" && obj.get(node, "parent.type") === "MemberExpression" && obj.get(node, "parent.property.name") === "should";
}

/**
 * Detect `MemberExpression` as `someVal.should`
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isShould(node) {
  return node.type === "MemberExpression" && obj.get(node , "property.name") === "should";
}

/**
 * Detect `MemberExpression` as 'chainable getters'
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isChaiChainable(node) {
  return node.type === "MemberExpression" && chainable.indexOf(obj.get(node , "property.name")) !== -1;
}

/**
 * Detect `Identifier` as part of `expect(...).to`
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isParentExpect(node) {
  return node.name === "expect" && obj.get(node, "parent.type") === "CallExpression" && obj.get(node, "parent.callee.name") === "expect";
}

/**
 * Detect `CallExpression` as `expect(...).to`
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isExpect(node) {
  return node.type === "CallExpression" && obj.get(node, "callee.name") === "expect";
}

/**
 * Detect `Identifier` as part of `assert.equal(...)`
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isParentAssert(node) {
  return node.name === "assert" && obj.get(node, "parent.type") === "MemberExpression" && obj.get(node, "parent.object.name") === "assert";
}

/**
 * Detect `MemberExpression` as `assert.equal(...)`
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isAssert(node) {
  return node.type === "MemberExpression" && obj.get(node, "object.name") === "assert";
}

/**
 * Detect `describe` or `it` 'body'
 * Also can detect skipped `describe` and `it`
 *
 * @param {ASTNode} node
 * @param {string} type
 * @returns {boolean}
 */
function isTestBody(node, type) {
  var parentType = obj.get(node, "parent.callee.object") ? "MemberExpression" : "Identifier";
  if (parentType === "MemberExpression") {
    return obj.get(node, "parent.callee.object.name") === type && obj.get(node, "parent.arguments.1") === node;
  }
  if (parentType === "Identifier") {
    return obj.get(node, "parent.callee.name") === type && obj.get(node, "parent.arguments.1") === node;
  }
  return false;
}

/**
 * Detect if `node` is 'test'-node and it is skipped (`it.skip` or `describe.skip`)
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isTestSkipped(node) {
  if (node.type !== "CallExpression") {
    return false;
  }
  var o = obj.get(node, "callee.object.name");
  if (tests.indexOf(o) === -1) {
    return false;
  }
  var prop = obj.get(node, "callee.property.name");
  return prop === "skip";
}

/**
 * Try to detect if `node` is in the skipped test
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function tryDetectSkipInParent(node) {
  var n = node;
  while (n) {
    if (isTestSkipped(n)) {
      return true;
    }
    n = n.parent;
  }
  return false;
}

/**
 * Detect if `node` is `describe`-body
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isDescribeBody(node) {
  return isTestBody(node, "describe");
}

/**
 * Detect if `node` is `it`-body
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isItBody(node) {
  return isTestBody(node, "it");
}

/**
 * Detect if `node` is part of assertion (Chai or Sinon)
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isParentAssertion (node) {
  return isParentShould(node) || isParentExpect(node) || isParentAssert(node) || isParentSinonAssert(node);
}

/**
 * Detect if `node is assertion (Chai or Sinon)
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isAssertion (node) {
  return isShould(node) || isExpect(node) || isAssert(node) || isSinonAssert(node);
}

module.exports = {

  isParentShould: isParentShould,
  isParentExpect: isParentExpect,
  isParentAssert: isParentAssert,
  isParentSinonAssert: isParentSinonAssert,

  isShould: isShould,
  isExpect: isExpect,
  isAssert: isAssert,
  isSinonAssert: isSinonAssert,

  isItBody: isItBody,
  isDescribeBody: isDescribeBody,

  isParentAssertion: isParentAssertion,
  isAssertion: isAssertion,

  isChaiChainable: isChaiChainable,

  tryDetectSkipInParent: tryDetectSkipInParent

};