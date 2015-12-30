var obj = require('./obj.js');

var tests = ["describe", "it"];

function isParentShould(node) {
  return node.name === "should" && obj.get(node, "parent.type") === "MemberExpression" && obj.get(node, "parent.property.name") === "should";
}

function isShould(node) {
  return node.type === "MemberExpression" && obj.get(node , 'property.name') === "should";
}

function isParentExpect(node) {
  return node.name === "expect" && obj.get(node, "parent.type") === "CallExpression" && obj.get(node, "parent.callee.name") === "expect";
}

function isExpect(node) {
  return node.type === "CallExpression" && obj.get(node, "callee.name") === "expect";
}

function isParentAssert(node) {
  return node.name === "assert" && obj.get(node, "parent.type") === "MemberExpression" && obj.get(node, "parent.object.name") === "assert";
}

function isAssert(node) {
  return node.type === "MemberExpression" && obj.get(node, "object.name") === "assert";
}

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

function isDescribeBody(node) {
  return isTestBody(node, 'describe');
}

function isItBody(node) {
  return isTestBody(node, 'it');
}

function isParentAssertion (node) {
  return isParentShould(node) || isParentExpect(node) || isParentAssert(node);
}

function isAssertion (node) {
  return isShould(node) || isExpect(node) || isAssert(node);
}

module.exports = {

  isParentShould: isParentShould,
  isParentExpect: isParentExpect,
  isParentAssert: isParentAssert,

  isShould: isShould,
  isExpect: isExpect,
  isAssert: isAssert,

  isItBody: isItBody,
  isDescribeBody: isDescribeBody,

  isParentAssertion: isParentAssertion,
  isAssertion: isAssertion,

  tryDetectSkipInParent: tryDetectSkipInParent

}