"use strict";

var rule = require("../../../lib/rules/no-empty-title"),
  RuleTester = require("eslint").RuleTester;
var testHelpers = require("../../../lib/utils/tests.js");
var ruleTester = new RuleTester();

var titles = [
  {TITLE: "''"},
  {TITLE: "'    '"},
  {TITLE: "'\t'"}
];

var validTestTemplates = [
  {
    code:
      "TEST('some title', function () {});"
  },
  {
    code:
      "TEST(123, function () {});"
  },
  {
    code:
      "var a = '12'; " +
      "TEST(a, function () {});"
  },
  {
    code:
      "function a() {" +
        "return sinon.stub()" +
      "}; " +
      "TEST('some title', function () {});"
  },
  {
    code:
      "TEST('1234', function() {}); sinon.stub();"
  },
  {
    code:
      "var a = function () {" +
        "return '123';" +
      "}; " +
      "TEST(a(), function () {});"
  },
  {
    code:
      "SUITE('title', function () {" +
        "TEST('some title', function () {});" +
      "});"
  },
  {
    code:
      "var a = '12';" +
      "SUITE(a, function () {" +
        "TEST('some title', function () {});" +
      "});"
  },
  {
    code:
      "var a = function () {" +
        "return '123';" +
      "}; " +
      "SUITE(a(), function () {" +
        "TEST('some title', function () {});" +
      "});"
  },
  {
    code:
      "TESTSKIP(TITLE, function () {});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITESKIP(TITLE, function () {" +
        "TEST('some title', function () {});" +
      "});",
    options: [{skipSkipped: true}]
  }
];

var invalidTestTemplates = [
  {
    code:
      "TEST(TITLE, function () {});",
    errors: [{message: "Empty title is not allowed for `TEST`.", type: "CallExpression"}]
  },
  {
    code:
      "SUITESKIP('123', function () {" +
        "TEST(TITLE, function () {});" +
      "});",
    errors: [{message: "Empty title is not allowed for `TEST`.", type: "CallExpression"}]
  },
  {
    code:
      "SUITE(TITLE, function () {" +
        "TEST('some title', function () {});" +
      "});",
    errors: [{message: "Empty title is not allowed for `SUITE`.", type: "CallExpression"}]
  },
  {
    code:
      "TESTSKIP(TITLE, function () {});",
    errors: [{message: "Empty title is not allowed for `TESTSKIP`.", type: "CallExpression"}]
  },
  {
    code:
      "SUITESKIP(TITLE, function () {" +
        "TEST('some title', function () {});" +
      "});",
    errors: [{message: "Empty title is not allowed for `SUITESKIP`.", type: "CallExpression"}]
  }
];

ruleTester.run("no-empty-title", rule, {
  valid: testHelpers.getCombos(testHelpers.getCombos(validTestTemplates, titles)),
  invalid: testHelpers.getCombos(testHelpers.getCombos(invalidTestTemplates, titles))
});