"use strict";

var rule = require("../../../lib/rules/asserts-limit"),
  RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();

var assertions = ["expect(1).to.be.equal(1);", "'1'.should.equal('1');", "assert.equal(1, 1);"];

ruleTester.run("asserts-limit", rule, {
  valid: [
    {code: "it('1234', function () {" + assertions.join('') + "});"},
    {code: "it('1234', function () {" + assertions.join('') + "});", options: [4]},
    {code: "it('1234', function () {assert;});"},
    {code: "it('1234', function () {should;});"},
    {code: "it('1234', function () {should();});"},
    {code: "it('1234', function () {expect;});"},
    {code: "it('1234', function () {var expect = {};});"},
    {code: "it('1234', function () {var should = {};});"},
    {code: "it('1234', function () {var assert = {};});"}
  ],

  invalid: [
    {
      code: "it('1234', function () {" + assertions.join('') + "});",
      options: [2],
      errors: [{message: "Too many assertions (3). Maximum allowed is 2."}]
    },
    {
      code: "it('1234', function () {" + assertions[0] + assertions[0] + assertions[0] + "});",
      options: [2],
      errors: [{message: "Too many assertions (3). Maximum allowed is 2."}]
    },
    {
      code: "it('1234', function () {" + assertions[1] + assertions[1] + assertions[1] + "});",
      options: [2],
      errors: [{message: "Too many assertions (3). Maximum allowed is 2."}]
    },
    {
      code: "it('1234', function () {" + assertions[1] + assertions[1] + assertions[1] + "});",
      options: [2],
      errors: [{message: "Too many assertions (3). Maximum allowed is 2."}]
    }
  ]
});