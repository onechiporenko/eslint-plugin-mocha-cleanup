"use strict";

var rule = require("../../../lib/rules/no-assertions-outside-it"),
  RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();

var testHelpers = require("../../../lib/utils/tests.js");

var assertions = ["expect(1).to.be.equal(1);", "'1'.should.equal('1');", "assert.equal(1, 1);", "sinon.assert.calledOn(sp, {});"];

var asserts = [
  {ASSERT: "expect(1).to.be.equal(1);"},
  {ASSERT: "'1'.should.equal('1');"},
  {ASSERT: "assert.equal(1, 1);"},
  {ASSERT: "sinon.assert.calledOn(sp, {});"}
];

var validTestTemplates = [
  {
    code:
      "TEST('1234', function () {" +
        "ASSERT" +
      "});"
  },
  {
    code:
      "SUITE('1234', function () {" +
        "assert;" +
      "});"
  },
  {
    code:
      "SUITE('1234', function () {" +
        "should;" +
      "});"
  },
  {
    code:
      "SUITE('1234', function () {" +
        "should();" +
      "});"
  },
  {
    code:
      "SUITE('1234', function () {" +
        "expect;" +
      "});"
  },
  {
    code:
      "SUITE('1234', function () {" +
        "var expect = {};" +
      "});"
  },
  {
    code:
      "SUITE('1234', function () {" +
        "var should = {};" +
      "});"
  },
  {
    code:
      "SUITE('1234', function () {" +
        "var assert = {};" +
      "});"
  },

  {
    code:
      "SUITESKIP('1234', function () {" +
        "ASSERT" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        "TEST('321', function () {});" +
        "ASSERT" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        "ASSERT" +
      "});",
    options: [{skipSkipped: true}]
  }
];

var invalidTestTemplates = [
  {
    code:
      "SUITE('1234', function () {" +
        "ASSERT" +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "SUITE('1234', function () {" +
        "TEST('321', function () {});" +
        "ASSERT" +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "SUITE('1234', function () {" +
        "ASSERT" +
        "ASSERT" +
        "ASSERT" +
        "ASSERT" +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"},
      {message: "Assertion outside tests is not allowed.", type: "Identifier"},
      {message: "Assertion outside tests is not allowed.", type: "Identifier"},
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        "TEST('321', function () {});" +
        "ASSERT" +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        "ASSERT" +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        "ASSERT" +
        "ASSERT" +
        "ASSERT" +
        "ASSERT" +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"},
      {message: "Assertion outside tests is not allowed.", type: "Identifier"},
      {message: "Assertion outside tests is not allowed.", type: "Identifier"},
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  }
];

ruleTester.run("no-assertions-outside-it", rule, {
  valid: testHelpers.getCombos(testHelpers.getCombos(validTestTemplates, asserts)),
  invalid: testHelpers.getCombos(testHelpers.getCombos(invalidTestTemplates, asserts))
});