var obj = require("./obj.js");

var mocha = require("./mocha-specs.js");

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
function isParentChaiShould(node) {
  return node.name === "should" && obj.get(node, "parent.type") === "MemberExpression" && obj.get(node, "parent.property.name") === "should";
}

/**
 * Detect `MemberExpression` as `someVal.should`
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isChaiShould(node) {
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
function isParentChaiExpect(node) {
  return node.name === "expect" && obj.get(node, "parent.type") === "CallExpression" && obj.get(node, "parent.callee.name") === "expect";
}

/**
 * Detect `CallExpression` as `expect(...).to`
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isChaiExpect(node) {
  return node.type === "CallExpression" && obj.get(node, "callee.name") === "expect";
}

/**
 * Detect `Identifier` as part of `assert.equal(...)`
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isParentChaiAssert(node) {
  return node.name === "assert" && obj.get(node, "parent.type") === "MemberExpression" && obj.get(node, "parent.object.name") === "assert";
}

/**
 * Detect `MemberExpression` as `assert.equal(...)`
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isChaiAssert(node) {
  return node.type === "MemberExpression" && obj.get(node, "object.name") === "assert";
}

/**
 * Detect suite or test 'body'
 * Also can detect skipped suites and tests
 *
 * @param {ASTNode} node
 * @param {string} type
 * @returns {boolean}
 */
function isBlockBody(node, type) {
  var types = Array.isArray(type) ? type : [type];
  var parentType = obj.get(node, "parent.callee.object") ? "MemberExpression" : "Identifier";
  if (parentType === "MemberExpression") {
    return types.indexOf(obj.get(node, "parent.callee.object.name") + "." + obj.get(node, "parent.callee.property.name")) !== -1 && obj.get(node, "parent.arguments.1") === node;
  }
  if (parentType === "Identifier") {
    return types.indexOf(obj.get(node, "parent.callee.name")) !== -1 && obj.get(node, "parent.arguments.1") === node;
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
  if (obj.get(node, "callee.type") === "Identifier") {
    return mocha.allSkipped.indexOf(obj.get(node, "callee.name")) !== -1;
  }
  var o = obj.get(node, "callee.object.name");
  if (mocha.allBlocks.indexOf(o) === -1) {
    return false;
  }
  var prop = obj.get(node, "callee.property.name");
  return mocha.allSkipped.indexOf(o + '.' + prop) !== -1;
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
 * Detect if `node` is `suite`-body
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isSuiteBody(node) {
  return isBlockBody(node, mocha.allSuites);
}

/**
 * Detect if `node` is `test`-body
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isTestBody(node) {
  return isBlockBody(node, mocha.allTests);
}

/**
 * Detect if `node` is part of assertion (Chai or Sinon)
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isParentAssertion (node) {
  return isParentChaiShould(node) || isParentChaiExpect(node) || isParentChaiAssert(node) || isParentSinonAssert(node);
}

/**
 * Detect if `node is assertion (Chai or Sinon)
 *
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isAssertion (node) {
  return isChaiShould(node) || isChaiExpect(node) || isChaiAssert(node) || isSinonAssert(node);
}

/**
 * Get "full" callee-name, like `describe.skip`, `xit` etc
 *
 * @param {ASTNode} node
 * @returns {string}
 */
function getCaller (node) {
  var o, p;
  if (obj.get(node, "type") === "MemberExpression") {
    o = obj.get(node, "object.type") === "MemberExpression" ? getCaller(node.object) : obj.get(node, "object.name");
    p = obj.get(node, "property.name");
    return p ? o + "." + p : o;
  }
  var callee = obj.get(node, "callee");
  if (!callee) {
    return "";
  }
  if (obj.get(callee, "type") === "MemberExpression") {
    o = obj.get(callee, "object.type") === "MemberExpression" ? getCaller(callee.object) : obj.get(callee, "object.name");
    p = obj.get(callee, "property.name");
    return p ? o + "." + p : o;
  }
  return obj.get(callee, "name");
}

module.exports = {

  isParentChaiShould: isParentChaiShould,
  isParentChaiExpect: isParentChaiExpect,
  isParentChaiAssert: isParentChaiAssert,
  isParentSinonAssert: isParentSinonAssert,

  isChaiShould: isChaiShould,
  isChaiExpect: isChaiExpect,
  isChaiAssert: isChaiAssert,
  isSinonAssert: isSinonAssert,

  isTestBody: isTestBody,
  isSuiteBody: isSuiteBody,

  isParentAssertion: isParentAssertion,
  isAssertion: isAssertion,

  isChaiChainable: isChaiChainable,

  tryDetectSkipInParent: tryDetectSkipInParent,

  getCaller: getCaller

};