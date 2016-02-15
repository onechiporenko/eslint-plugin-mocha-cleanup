"use strict";

var rule = require("../../../lib/rules/no-assertions-outside-it"),
  RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();

var testHelpers = require("../../../lib/utils/tests.js");

var Jsonium = require('jsonium');
var j = new Jsonium();

var asserts = [
  {ASSERT: "expect(1).to.be.equal(1);", TYPE: "CallExpression"},
  {ASSERT: "'1'.should.equal('1');", TYPE: "MemberExpression"},
  {ASSERT: "'1'['should'].equal('1');", TYPE: "MemberExpression"},
  {ASSERT: "assert.equal(1, 1);", TYPE: "MemberExpression"},
  {ASSERT: "sinon.assert.calledOn(sp, {});", TYPE: "MemberExpression"},
  {ASSERT: "sinon['assert'].calledOn(sp, {});", TYPE: "MemberExpression"}
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
      {message: "Assertion outside tests is not allowed.", type: "{{TYPE}}"}
    ]
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "{{TEST}}('321', function () {});" +
        "{{ASSERT}}" +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "{{TYPE}}"}
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
      {message: "Assertion outside tests is not allowed.", type: "{{TYPE}}"},
      {message: "Assertion outside tests is not allowed.", type: "{{TYPE}}"},
      {message: "Assertion outside tests is not allowed.", type: "{{TYPE}}"},
      {message: "Assertion outside tests is not allowed.", type: "{{TYPE}}"}
    ]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{TEST}}('321', function () {});" +
        "{{ASSERT}}" +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "{{TYPE}}"}
    ]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{ASSERT}}" +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "{{TYPE}}"}
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
      {message: "Assertion outside tests is not allowed.", type: "{{TYPE}}"},
      {message: "Assertion outside tests is not allowed.", type: "{{TYPE}}"},
      {message: "Assertion outside tests is not allowed.", type: "{{TYPE}}"},
      {message: "Assertion outside tests is not allowed.", type: "{{TYPE}}"}
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
  .createCombos(['code', 'errors.@each.type'], asserts)
  .useCombosAsTemplates()
  .createCombos(['code', 'errors.@each.message'], testHelpers.mochaDatasets)
  .uniqueCombos()
  .getCombos();


ruleTester.run("no-assertions-outside-it", rule, {
  valid: validTests,
  invalid: invalidTests
});