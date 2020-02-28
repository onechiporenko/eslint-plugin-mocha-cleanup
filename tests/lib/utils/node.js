"use strict";

var assert = require("assert");
var espree = require("espree");
var node = require("../../../lib/utils/node.js");

describe("obj", function () {
  it("`isSuiteBody` (`isBlockBody`) called with node with no parent", function () {
    var result = node.isSuiteBody(espree.parse(""));
    assert(!result);
  });

  it("`getParentExpression` (`_getParentByTypes`) called with node with no parent", function () {
    var result = node.getParentExpression(espree.parse(""));
    assert(!result);
  });
});
