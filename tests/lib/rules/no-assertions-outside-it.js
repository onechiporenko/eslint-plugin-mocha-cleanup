"use strict";

var rule = require("../../../lib/rules/no-assertions-outside-it"),
  RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();

var testHelpers = require("../../../lib/utils/tests.js");

var Jsonium = require('jsonium');
var j = new Jsonium();

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
      "{{TEST}}('1234', function () {" +
        "{{ASSERT}}" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "assert;" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "should;" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "should();" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "expect;" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "var expect = {};" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "var should = {};" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "var assert = {};" +
      "});"
  },

  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{ASSERT}}" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{TEST}}('321', function () {});" +
        "{{ASSERT}}" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{ASSERT}}" +
      "});",
    options: [{skipSkipped: true}]
  }
];

var invalidTestTemplates = [
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "{{ASSERT}}" +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "{{TEST}}('321', function () {});" +
        "{{ASSERT}}" +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "{{ASSERT}}" +
        "{{ASSERT}}" +
        "{{ASSERT}}" +
        "{{ASSERT}}" +
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
      "{{SUITESKIP}}('1234', function () {" +
        "{{TEST}}('321', function () {});" +
        "{{ASSERT}}" +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{ASSERT}}" +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{ASSERT}}" +
        "{{ASSERT}}" +
        "{{ASSERT}}" +
        "{{ASSERT}}" +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"},
      {message: "Assertion outside tests is not allowed.", type: "Identifier"},
      {message: "Assertion outside tests is not allowed.", type: "Identifier"},
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  }
];

var validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(['code'], asserts)
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.mochaDatasets)
  .uniqueCombos()
  .getCombos();

j.clearTemplates().clearCombos();

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(['code'], asserts)
  .useCombosAsTemplates()
  .createCombos(['code', 'errors.0.message', 'errors.1.message', 'errors.2.message', 'errors.3.message'], testHelpers.mochaDatasets)
  .uniqueCombos()
  .getCombos();


ruleTester.run("no-assertions-outside-it", rule, {
  valid: validTests,
  invalid: invalidTests
});