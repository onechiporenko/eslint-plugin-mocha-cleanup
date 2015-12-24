var obj = require('./obj.js');

function isShould(node) {
  return node.name === "should" && obj.get(node, "parent.type") === "MemberExpression" && obj.get(node, "parent.property.name") === "should";
}

function isExpect(node) {
  return node.name === "expect" && obj.get(node, "parent.type") === "CallExpression" && obj.get(node, "parent.callee.name") === "expect";
}

function isAssert(node) {
  return node.name === "assert" && obj.get(node, "parent.type") === "MemberExpression" && obj.get(node, "parent.object.name") === "assert";
}

function isTestBody(node, type) {
  return obj.get(node, "parent.callee.name") === type && obj.get(node, "parent.arguments.1") === node;
}

function isDescribeBody(node) {
  return isTestBody(node, 'describe');
}

function isItBody(node) {
  return isTestBody(node, 'it');
}

function isAssertion (node) {
  return isShould(node) || isExpect(node) || isAssert(node);
}

module.exports = {

  isShould: isShould,
  isExpect: isExpect,
  isAssert: isAssert,

  isItBody: isItBody,
  isDescribeBody: isDescribeBody,

  isAssertion: isAssertion

}