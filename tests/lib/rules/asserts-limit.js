"use strict";

var rule = require("../../../lib/rules/asserts-limit"),
  RuleTester = require("eslint").RuleTester;
var testHelpers = require("../../../lib/utils/tests.js");

var ruleTester = new RuleTester();

var assert = ["expect(1).to.be.equal(1);", "'1'.should.equal('1');", "assert.equal(1, 1);", "sinon.assert.calledOn(sp, {});"];

var assertions = [
  {ASSERTION: assert[0]},
  {ASSERTION: assert[1]},
  {ASSERTION: assert[2]},
  {ASSERTION: assert[3]}
];

var validTestTemplates = [
    {
      code:
        "TEST('1234', function () {" +
          "ASSERTION ASSERTION ASSERTION ASSERTION" +
        "});",
      options: [{assertsLimit: 4}]
    },
    {
      code:
        "TEST('1234', function () {" +
          "assert; ASSERTION" +
        "});"
    },
    {
      code:
        "TEST('1234', function () {" +
          "should; ASSERTION" +
        "});"
    },
    {
      code:
        "TEST('1234', function () {" +
          "should(); ASSERTION" +
        "});"
    },
    {
      code:
        "TEST('1234', function () {" +
          "expect; ASSERTION" +
        "});"
    },
    {
      code:
        "TEST('1234', function () {" +
          "var expect = {};" + assertions[0] +
        "});"
    },
    {
      code:
        "TEST('1234', function () {" +
          "var should = {}; ASSERTION" +
        "});"
    },
    {
      code:
        "TEST('1234', function () {" +
          "var assert = {}; ASSERTION" +
        "});"
    },
    {
      code:
        "SUITESKIP('1234', function () { " +
          "TEST('1234', function () {" +
            "ASSERTION ASSERTION ASSERTION" +
          "});" +
         "});",
      options: [{assertsLimit: 1, skipSkipped: true}],
      errors: [{message: "Too many assertions (3). Maximum allowed is 2."}]
    },
    {
      code:
        "SUITESKIP('1234', function () { " +
          "SUITE('4321', function () { " +
            "TEST('1234', function () {" +
              "ASSERTION ASSERTION ASSERTION" +
            "});" +
          "});" +
        "});",
      options: [{assertsLimit: 1, skipSkipped: true}]
    },
    {
      code:
        "TEST('1234', function (done) {" +
          "done();" +
        "});"
    },
    {
      code:
        "TEST('1234', function (done) {});"
    },
    {
      code:
        "TEST('1234', function (notDone) {" +
          "notDone();" +
        "});"
    },
    {
      code:
        "TEST('1234', function (notDone) {});"
    },
    {
      code:
       "TESTSKIP('1234', function () {" +
          "ASSERTION ASSERTION ASSERTION" +
        "});",
      options: [{assertsLimit: 1, skipSkipped: true}]
    },
    {
      code:
       "TESTSKIP('1234', function () {});",
      options: [{assertsLimit: 1, skipSkipped: true}]
    },
    {
      code:
        "SUITESKIP('1234', function () { " +
          "TEST('1234', function () {});" +
        "});",
      options: [{assertsLimit: 1, skipSkipped: true}]
    },
    {
      code:
        "SUITESKIP('1234', function () { " +
          "SUITE('4321', function () { " +
            "TEST('1234', function () {});" +
          "});" +
        "});",
      options: [{assertsLimit: 1, skipSkipped: true}]
    }
  ];

var invalidTestTemplates = [
    {
      code:
        "TEST('1234', function () {" +
          "ASSERTION ASSERTION ASSERTION" +
        "});",
      options: [{assertsLimit: 2}],
      errors: [{message: "Too many assertions (3). Maximum allowed is 2.", type: "CallExpression"}]
    },
    {
      code:
        "SUITESKIP('1234', function () { " +
          "SUITE('4321', function () { " +
            "TEST('1234', function () {" +
              "ASSERTION ASSERTION ASSERTION" +
            "});" +
          "});" +
        "});",
      options: [{assertsLimit: 1}],
      errors: [{message: "Too many assertions (3). Maximum allowed is 1.", type: "CallExpression"}]
    },
    {
      code:
        "TESTSKIP('1234', function () {" +
          "ASSERTION ASSERTION ASSERTION" +
        "});",
      options: [{assertsLimit: 1}],
      errors: [{message: "Too many assertions (3). Maximum allowed is 1.", type: "CallExpression"}]
    }
  ];
  var invalidTestTemplatesWithoutAssertions = [
    {
      code:
        "TEST('1234', function () {});",
      errors: [{message: "Test without assertions is not allowed.", type: "CallExpression"}]
    },
    {
      code:
        "TESTSKIP('1234', function () {});",
      errors: [{message: "Test without assertions is not allowed.", type: "CallExpression"}]
    },
    {
      code:
        "SUITESKIP('1234', function () { " +
          "TEST('1234', function () {});" +
        "});",
      errors: [{message: "Test without assertions is not allowed.", type: "CallExpression"}]
    },
    {
      code:
        "SUITE('1234', function () { " +
          "TEST('1234', function () {});" +
        "});",
      errors: [{message: "Test without assertions is not allowed.", type: "CallExpression"}]
    },
    {
      code:
        "SUITESKIP('1234', function () { " +
          "SUITE('4321', function () { " +
            "TEST('1234', function () {});" +
          "});" +
        "});",
      errors: [{message: "Test without assertions is not allowed.", type: "CallExpression"}]
    },
    {
      code:
        "TEST('1234', function (done) {" +
          "done();" +
        "});",
      options: [{assertsLimit: 1, skipSkipped: true, ignoreZeroAssertionsIfDoneExists: false}],
      errors: [{message: "Test without assertions is not allowed.", type: "CallExpression"}]
    },
    {
      code:
        "TEST('1234', function (done) {});",
      options: [{assertsLimit: 1, skipSkipped: true, ignoreZeroAssertionsIfDoneExists: false}],
      errors: [{message: "Test without assertions is not allowed.", type: "CallExpression"}]
    },
    {
      code:
        "TEST('1234', function (notDone) {" +
          "notDone();" +
        "});",
      options: [{assertsLimit: 1, skipSkipped: true, ignoreZeroAssertionsIfDoneExists: false}],
      errors: [{message: "Test without assertions is not allowed.", type: "CallExpression"}]
    },
    {
      code:
        "TEST('1234', function (notDone) {});",
      options: [{assertsLimit: 1, skipSkipped: true, ignoreZeroAssertionsIfDoneExists: false}],
      errors: [{message: "Test without assertions is not allowed.", type: "CallExpression"}]
    }
  ];

function filter(combo) {
  return !combo.code.match(/\{\s*\}/);
}

var valid = testHelpers.getCombos(testHelpers.getCombos(validTestTemplates, assertions)).filter(filter);
var invalid = testHelpers.getCombos(testHelpers.getCombos(invalidTestTemplates, assertions)).filter(filter);

ruleTester.run("asserts-limit", rule, {
  valid: valid,
  invalid: invalid.concat(testHelpers.getCombos(testHelpers.getCombos(invalidTestTemplatesWithoutAssertions, assertions)))
});