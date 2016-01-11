"use strict";

var rule = require("../../../lib/rules/no-same-titles"),
  RuleTester = require("eslint").RuleTester;
var testHelpers = require("../../../lib/utils/tests.js");
var ruleTester = new RuleTester();

var validTestTemplates = [
  {
    code:
      "TEST('123', function (){}); " +
      "SUITE('321', function () {" +
        "TEST('123', function (){});" +
      "});"
  },
  {
    code:
      "SUITE('321', function () {" +
        "TEST('123', function (){});" +
      "}); " +
      "SUITE('4321', function () {" +
        "TEST('123', function (){});" +
      "});"
  },
  {
    code:
      "SUITESKIP('4321', function () { " +
        "TEST('1234', function () {}); " +
        "TEST('1234', function () {}); " +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITESKIP('4321', function () { " +
        "SUITE('4321', function () { " +
          "TEST('1234', function () {}); " +
          "TEST('1234', function () {}); " +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  }
];

var invalidTestTemplates = [
  {
    code:
      "SUITE('4321', function () { " +
        "TEST('1234', function () {}); " +
        "TEST('1234', function () {}); " +
      "});",
    errors: [{message: "Some tests have same titles.", type: "CallExpression"}]
  },
  {
    code:
      "SUITESKIP('4321', function () { " +
        "TEST('1234', function () {}); " +
        "TEST('1234', function () {}); " +
      "});",
    errors: [{message: "Some tests have same titles.", type: "CallExpression"}]
  },
  {
    code:
      "SUITESKIP('4321', function () { " +
        "SUITE('4321', function () { " +
          "TEST('1234', function () {}); " +
          "TEST('1234', function () {}); " +
        "});" +
      "});",
    errors: [{message: "Some tests have same titles.", type: "CallExpression"}]
  }
];

ruleTester.run("no-same-title", rule, {
  valid: testHelpers.getCombos(validTestTemplates),
  invalid: testHelpers.getCombos(invalidTestTemplates)
});