"use strict";

var rule = require("../../../lib/rules/no-empty-title"),
  RuleTester = require("eslint").RuleTester;
var testHelpers = require("../../../lib/utils/tests.js");
var ruleTester = new RuleTester();

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
      "TESTSKIP('', function () {});",
    options: [true]
  },
  {
    code:
      "TESTSKIP('   ', function () {});",
    options: [true]
  },
  {
    code:
      "TESTSKIP('\t', function () {});",
    options: [true]
  },
  {
    code:
      "SUITESKIP('', function () {" +
        "TEST('some title', function () {});" +
      "});",
    options: [true]
  },
  {
    code:
      "SUITESKIP('   ', function () {" +
        "TEST('some title', function () {});" +
      "});",
    options: [true]
  },
  {
    code:
      "SUITESKIP('\t', function () {" +
        "TEST('some title', function () {});" +
      "});",
    options: [true]
  }
];

var invalidTestTemplates = [
  {
    code:
      "TEST('', function () {});",
    errors: [{message: "Empty title is not allowed for `TEST`.", type: "CallExpression"}]
  },
  {
    code:
      "TEST('   ', function () {});",
    errors: [{message: "Empty title is not allowed for `TEST`.", type: "CallExpression"}]
  },
  {
    code:
      "TEST('\t', function () {});",
    errors: [{message: "Empty title is not allowed for `TEST`.", type: "CallExpression"}]
  },
  {
    code:
      "SUITESKIP('123', function () {" +
        "TEST('', function () {});" +
      "});",
    errors: [{message: "Empty title is not allowed for `TEST`.", type: "CallExpression"}]
  },
  {
    code:
      "SUITESKIP('123', function () {" +
        "TEST('   ', function () {});" +
      "});",
    errors: [{message: "Empty title is not allowed for `TEST`.", type: "CallExpression"}]
  },
  {
    code:
      "SUITESKIP('123', function () {" +
        "TEST('\t', function () {});" +
      "});",
    errors: [{message: "Empty title is not allowed for `TEST`.", type: "CallExpression"}]
  },
  {
    code:
      "SUITE('', function () {" +
        "TEST('some title', function () {});" +
      "});",
    errors: [{message: "Empty title is not allowed for `SUITE`.", type: "CallExpression"}]
  },
  {
    code:
      "SUITE('   ', function () {" +
        "TEST('some title', function () {});" +
      "});",
    errors: [{message: "Empty title is not allowed for `SUITE`.", type: "CallExpression"}]
  },
  {
    code:
      "SUITE('\t', function () {" +
        "TEST('some title', function () {});" +
      "});",
    errors: [{message: "Empty title is not allowed for `SUITE`.", type: "CallExpression"}]
  },
  {
    code:
      "TESTSKIP('', function () {});",
    errors: [{message: "Empty title is not allowed for `TESTSKIP`.", type: "CallExpression"}]
  },
  {
    code:
      "TESTSKIP('   ', function () {});",
    errors: [{message: "Empty title is not allowed for `TESTSKIP`.", type: "CallExpression"}]
  },
  {
    code:
      "TESTSKIP('\t', function () {});",
    errors: [{message: "Empty title is not allowed for `TESTSKIP`.", type: "CallExpression"}]
  },
  {
    code:
      "SUITESKIP('', function () {" +
        "TEST('some title', function () {});" +
      "});",
    errors: [{message: "Empty title is not allowed for `SUITESKIP`.", type: "CallExpression"}]
  },
  {
    code:
      "SUITESKIP('   ', function () {" +
        "TEST('some title', function () {});" +
      "});",
    errors: [{message: "Empty title is not allowed for `SUITESKIP`.", type: "CallExpression"}]
  },
  {
    code:
      "SUITESKIP('\t', function () {" +
        "TEST('some title', function () {});" +
      "});",
    errors: [{message: "Empty title is not allowed for `SUITESKIP`.", type: "CallExpression"}]
  }
];

ruleTester.run("no-empty-title", rule, {
  valid: testHelpers.getCombos(validTestTemplates),
  invalid: testHelpers.getCombos(invalidTestTemplates)
});