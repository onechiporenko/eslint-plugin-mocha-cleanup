"use strict"

const assert = require("assert")
const espree = require("espree")
const node = require("../../../lib/utils/node.js")

describe("obj", function () {
  it("`isSuiteBody` (`isBlockBody`) called with node with no parent", function () {
    const result = node.isSuiteBody(espree.parse(""))
    assert(!result)
  })

  it("`getParentExpression` (`_getParentByTypes`) called with node with no parent", function () {
    const result = node.getParentExpression(espree.parse(""))
    assert(!result)
  })
})
