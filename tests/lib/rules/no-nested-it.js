"use strict";

var rule = require("../../../lib/rules/no-nested-it"),
  RuleTester = require("eslint").RuleTester;
var testHelpers = require("../../../lib/utils/tests.js");
var ruleTester = new RuleTester();

var validTestTemplates = [
  {
    code:
      "TEST('123', function (){}); " +
      "SUITE('321', function () {" +
        " TEST('123', function (){});" +
      "});"
  },
  {
    code:
      "SUITE('321', function () {" +
        "TEST('123', function (){" +
          "some.it;" +
        "});" +
      "});"
  },
  {
    code:
      "SUITE('321', function () {" +
        "TEST('123', function (){" +
          "it.abc();" +
        "});" +
      "});"
  },
  {
    code:
      "SUITE('321', function () {" +
        "TEST('123', function (){" +
          "abc.it();" +
        "});" +
      "});"
  },
  {
    code:
      "SUITE('321', function () {" +
        "TEST('123', function (){" +
          "abc.it('33', function () {});" +
        "});" +
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
      "SUITE('4321', function () {" +
        "SUITE('321', function () {" +
          "TEST('123', function (){});" +
        "}); " +
        "TEST('123', function (){});" +
      "});"
  },
  {
    code:
      "SUITESKIP('1234', function () { " +
        "TEST('1234', function () { " +
          "TEST('4321', function () {}); " +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITE('1234', function () { " +
        "TESTSKIP('1234', function () { " +
          "TEST('4321', function () {}); " +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITESKIP('1234', function () { " +
        "TEST('1234', function () { " +
          "TEST('4321', function () {" +
            "TEST('4321', function () {}); " +
          "}); " +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITE('1234', function () { " +
        "TESTSKIP('1234', function () { " +
          "TEST('4321', function () {" +
            "TEST('4321', function () {}); " +
          "}); " +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  }
];

var invalidTestTemplates = [
  {
    code:
      "SUITE('1234', function () { " +
        "TEST('1234', function () { " +
          "TEST('4321', function () {}); " +
        "});" +
      "});",
    errors: [{message: "Nested tests are not allowed. Only nested suites are allowed.", type: "CallExpression"}]
  },
  {
    code:
      "SUITE('1234', function () { " +
        "TEST('1234', function () { " +
          "TEST('4321', function () {" +
            "TEST('4321', function () {}); " +
          "}); " +
        "});" +
      "});",
    errors: [
      {message: "Nested tests are not allowed. Only nested suites are allowed.", type: "CallExpression"},
      {message: "Nested tests are not allowed. Only nested suites are allowed.", type: "CallExpression"}
    ]
  },
  {
    code:
      "SUITESKIP('1234', function () { " +
        "TEST('1234', function () { " +
          "TEST('4321', function () {}); " +
        "});" +
      "});",
    errors: [
      {message: "Nested tests are not allowed. Only nested suites are allowed.", type: "CallExpression"}
    ]
  },
  {
    code:
      "SUITESKIP('1234', function () { " +
        "SUITE('1234', function () { " +
          "TEST('1234', function () { " +
            "TEST('4321', function () {}); " +
          "});" +
        "});" +
      "});",
    errors: [
      {message: "Nested tests are not allowed. Only nested suites are allowed.", type: "CallExpression"}
    ]
  },
  {
    code:
      "SUITE('1234', function () { " +
        "TESTSKIP('1234', function () { " +
          "TEST('4321', function () {}); " +
        "});" +
      "});",
    errors: [
      {message: "Nested tests are not allowed. Only nested suites are allowed.", type: "CallExpression"}
    ]
  },
  {
    code:
    "SUITESKIP('1234', function () { " +
      "TEST('1234', function () { " +
        "TEST('4321', function () {" +
          "TEST('4321', function () {}); " +
        "}); " +
      "});" +
    "});",
    errors: [
      {message: "Nested tests are not allowed. Only nested suites are allowed.", type: "CallExpression"},
      {message: "Nested tests are not allowed. Only nested suites are allowed.", type: "CallExpression"}
    ]
  },
  {
    code:
      "SUITE('1234', function () { " +
        "TESTSKIP('1234', function () { " +
          "TEST('4321', function () {" +
            "TEST('4321', function () {}); " +
          "}); " +
        "});" +
      "});",
    errors: [
      {message: "Nested tests are not allowed. Only nested suites are allowed.", type: "CallExpression"},
      {message: "Nested tests are not allowed. Only nested suites are allowed.", type: "CallExpression"}
    ]
  }
];

ruleTester.run("no-nested-it", rule, {
  valid: testHelpers.getCombos(validTestTemplates),
  invalid: testHelpers.getCombos(invalidTestTemplates)
});