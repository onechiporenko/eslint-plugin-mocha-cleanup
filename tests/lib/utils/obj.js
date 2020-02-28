/**
 * @fileoverview Unit testing of `obj.js`'s currently unused methods
 */

"use strict"

var assert = require("assert")
var obj = require("../../../lib/utils/obj.js")

describe("obj", function () {
  it("Returns false for absent child path", function () {
    var result = obj.has({ a: { b: { c: 1 } } }, "a.b.d")
    assert(!result)
  })
  it("Returns true for present child path", function () {
    var result = obj.has({ a: { b: { c: 1 } } }, "a.b.c")
    assert(result)
  })
})
