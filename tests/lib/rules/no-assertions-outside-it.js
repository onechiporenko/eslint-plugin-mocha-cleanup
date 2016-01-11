"use strict";

var rule = require("../../../lib/rules/no-assertions-outside-it"),
  RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();

var testHelpers = require("../../../lib/utils/tests.js");

var assertions = ["expect(1).to.be.equal(1);", "'1'.should.equal('1');", "assert.equal(1, 1);", "sinon.assert.calledOn(sp, {});"];

var validTestTemplates = [
  {
    code:
      "TEST('1234', function () {" +
        assertions[0] +
      "});"
  },
  {
    code:
      "TEST('1234', function () {" +
        assertions[1] +
      "});"
  },
  {
    code:
      "TEST('1234', function () {" +
        assertions[2] +
      "});"
  },
  {
    code:
      "TEST('1234', function () {" +
        assertions[3] +
      "});"
  },
  {
    code:
      "TEST('1234', function () {" +
        assertions.join('') +
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
        assertions[0] +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        "TEST('321', function () {});" +
        assertions[0] +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        assertions[1] +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        "TEST('321', function () {});" +
        assertions[1] +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        assertions[2] +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        "TEST('321', function () {});" +
        assertions[2] +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        assertions[3] +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        "TEST('321', function () {});" +
        assertions[3] +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        assertions.join('') +
      "});",
    options: [{skipSkipped: true}]
  }
];

var invalidTestTemplates = [
  {
    code:
      "SUITE('1234', function () {" +
        assertions[0] +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "SUITE('1234', function () {" +
        "TEST('321', function () {});" +
        assertions[0] +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "SUITE('1234', function () {" +
        assertions[1] +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "SUITE('1234', function () {" +
        "TEST('321', function () {});" +
        assertions[1] +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "SUITE('1234', function () {" +
        assertions[2] +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "SUITE('1234', function () {" +
        "TEST('321', function () {});" +
        assertions[2] +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "SUITE('1234', function () {" +
        assertions[3] +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "SUITE('1234', function () {" +
        "TEST('321', function () {});" +
        assertions[3] +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "SUITE('1234', function () {" +
        assertions.join('') +
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
        assertions[0] +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        "TEST('321', function () {});" +
        assertions[0] +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        assertions[1] +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        "TEST('321', function () {});" +
        assertions[1] +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        assertions[2] +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        "TEST('321', function () {});" +
        assertions[2] +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        assertions[3] +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        "TEST('321', function () {});" +
        assertions[3] +
      "});",
    errors: [
      {message: "Assertion outside tests is not allowed.", type: "Identifier"}
    ]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        assertions.join('') +
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
  valid: testHelpers.getCombos(validTestTemplates),
  invalid: testHelpers.getCombos(invalidTestTemplates)
});