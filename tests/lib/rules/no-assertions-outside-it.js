"use strict";

var rule = require("../../../lib/rules/no-assertions-outside-it"),
  RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();

var assertions = ["expect(1).to.be.equal(1);", "'1'.should.equal('1');", "assert.equal(1, 1);", "sinon.assert.calledOn(sp, {});"];

ruleTester.run("no-assertions-outside-it", rule, {
  valid: [
    {
      code:
        "it('1234', function () {" +
          assertions[0] +
        "});"
    },
    {
      code:
        "it('1234', function () {" +
          assertions[1] +
        "});"
    },
    {
      code:
        "it('1234', function () {" +
          assertions[2] +
        "});"
    },
    {
      code:
        "it('1234', function () {" +
          assertions[3] +
        "});"
    },
    {
      code:
        "it('1234', function () {" +
          assertions.join('') +
        "});"
    },
    {
      code:
        "describe('1234', function () {" +
          "assert;" +
        "});"
    },
    {
      code:
        "describe('1234', function () {" +
          "should;" +
        "});"
    },
    {
      code:
        "describe('1234', function () {" +
          "should();" +
        "});"
    },
    {
      code:
        "describe('1234', function () {" +
          "expect;" +
        "});"
    },
    {
      code:
        "describe('1234', function () {" +
          "var expect = {};" +
        "});"
    },
    {
      code:
        "describe('1234', function () {" +
          "var should = {};" +
        "});"
    },
    {
      code:
        "describe('1234', function () {" +
          "var assert = {};" +
        "});"
    },

    {
      code:
        "describe.skip('1234', function () {" +
          assertions[0] +
        "});",
      options: [true]
    },
    {
      code:
        "describe.skip('1234', function () {" +
          "it('321', function () {});" +
          assertions[0] +
        "});",
      options: [true]
    },
    {
      code:
        "describe.skip('1234', function () {" +
          assertions[1] +
        "});",
      options: [true]
    },
    {
      code:
        "describe.skip('1234', function () {" +
          "it('321', function () {});" +
          assertions[1] +
        "});",
      options: [true]
    },
    {
      code:
        "describe.skip('1234', function () {" +
          assertions[2] +
        "});",
      options: [true]
    },
    {
      code:
        "describe.skip('1234', function () {" +
          "it('321', function () {});" +
            assertions[2] +
          "});",
      options: [true]
    },
    {
      code:
        "describe.skip('1234', function () {" +
          assertions[3] +
        "});",
      options: [true]
    },
    {
      code:
        "describe.skip('1234', function () {" +
          "it('321', function () {});" +
            assertions[3] +
          "});",
      options: [true]
    },
    {
      code:
        "describe.skip('1234', function () {" +
          assertions.join('') +
        "});",
      options: [true]
    }
  ],

  invalid: [
    {
      code:
        "describe('1234', function () {" +
          assertions[0] +
        "});",
      errors: [
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"}
      ]
    },
    {
      code:
        "describe('1234', function () {" +
          "it('321', function () {});" +
          assertions[0] +
        "});",
      errors: [
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"}
      ]
    },
    {
      code:
        "describe('1234', function () {" +
          assertions[1] +
        "});",
      errors: [
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"}
      ]
    },
    {
      code:
        "describe('1234', function () {" +
          "it('321', function () {});" +
          assertions[1] +
        "});",
      errors: [
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"}
      ]
    },
    {
      code:
        "describe('1234', function () {" +
          assertions[2] +
        "});",
      errors: [
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"}
      ]
    },
    {
      code:
        "describe('1234', function () {" +
          "it('321', function () {});" +
          assertions[2] +
        "});",
      errors: [
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"}
      ]
    },
    {
      code:
        "describe('1234', function () {" +
          assertions[3] +
        "});",
      errors: [
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"}
      ]
    },
    {
      code:
        "describe('1234', function () {" +
          "it('321', function () {});" +
          assertions[3] +
        "});",
      errors: [
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"}
      ]
    },
    {
      code:
        "describe('1234', function () {" +
          assertions.join('') +
        "});",
      errors: [
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"},
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"},
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"},
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"}
      ]
    },
    {
      code:
        "describe.skip('1234', function () {" +
          assertions[0] +
        "});",
      errors: [
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"}
      ]
    },
    {
      code:
        "describe.skip('1234', function () {" +
          "it('321', function () {});" +
          assertions[0] +
        "});",
      errors: [
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"}
      ]
    },
    {
      code:
        "describe.skip('1234', function () {" +
          assertions[1] +
        "});",
      errors: [
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"}
      ]
    },
    {
      code:
        "describe.skip('1234', function () {" +
          "it('321', function () {});" +
          assertions[1] +
        "});",
      errors: [
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"}
      ]
    },
    {
      code:
        "describe.skip('1234', function () {" +
          assertions[2] +
        "});",
      errors: [
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"}
      ]
    },
    {
      code:
        "describe.skip('1234', function () {" +
          "it('321', function () {});" +
          assertions[2] +
        "});",
      errors: [
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"}
      ]
    },
    {
      code:
        "describe.skip('1234', function () {" +
          assertions[3] +
        "});",
      errors: [
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"}
      ]
    },
    {
      code:
        "describe.skip('1234', function () {" +
          "it('321', function () {});" +
          assertions[3] +
        "});",
      errors: [
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"}
      ]
    },
    {
      code:
        "describe.skip('1234', function () {" +
          assertions.join('') +
        "});",
      errors: [
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"},
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"},
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"},
        {message: "Assertion outside `it` is not allowed.", type: "Identifier"}
      ]
    }
  ]
});