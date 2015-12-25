"use strict";

var rule = require("../../../lib/rules/no-empty-title"),
  RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();
ruleTester.run("no-empty-title", rule, {
  valid: [
    "it('some title', function () {});",

    "var a = '12'; " +
    "it(a, function () {});",

    "function a() {" +
      "return sinon.stub()" +
    "}; " +
    "it('some title', function () {});",

    "it('1234', function() {}); sinon.stub();",

    "var a = function () {" +
      "return '123';" +
    "}; " +
    "it(a(), function () {});",

    "describe('title', function () {" +
      "it('some title', function () {});" +
    "});",

    "var a = '12';" +
    "describe(a, function () {" +
      "it('some title', function () {});" +
    "});",

    "var a = function () {" +
      "return '123';" +
    "}; " +
    "describe(a(), function () {" +
      "it('some title', function () {});" +
    "});",
    {
      code: "it.skip('', function () {});",
      options: [true]
    },
    {
      code: "it.skip('   ', function () {});",
      options: [true]
    },
    {
      code: "it.skip('\t', function () {});",
      options: [true]
    },
    {
      code:
        "describe.skip('', function () {" +
          "it('some title', function () {});" +
        "});",
      options: [true]
    },
    {
      code:
        "describe.skip('   ', function () {" +
          "it('some title', function () {});" +
        "});",
      options: [true]
    },
    {
      code:
        "describe.skip('\t', function () {" +
          "it('some title', function () {});" +
        "});",
      options: [true]
    }
  ],

  invalid: [
    {
      code: "it('', function () {});",
      errors: [{message: "Empty title is not allowed for `it`.", type: "CallExpression"}]
    },
    {
      code: "it('   ', function () {});",
      errors: [{message: "Empty title is not allowed for `it`.", type: "CallExpression"}]
    },
    {
      code: "it('\t', function () {});",
      errors: [{message: "Empty title is not allowed for `it`.", type: "CallExpression"}]
    },
    {
      code:
        "describe.skip('123', function () {" +
          "it('', function () {});" +
        "});",
      errors: [{message: "Empty title is not allowed for `it`.", type: "CallExpression"}]
    },
    {
      code:
        "describe.skip('123', function () {" +
          "it('   ', function () {});" +
        "});",
      errors: [{message: "Empty title is not allowed for `it`.", type: "CallExpression"}]
    },
    {
      code:
        "describe.skip('123', function () {" +
          "it('\t', function () {});" +
        "});",
      errors: [{message: "Empty title is not allowed for `it`.", type: "CallExpression"}]
    },
    {
      code:
        "describe('', function () {" +
          "it('some title', function () {});" +
        "});",
      errors: [{message: "Empty title is not allowed for `describe`.", type: "CallExpression"}]
    },
    {
      code:
        "describe('   ', function () {" +
          "it('some title', function () {});" +
        "});",
      errors: [{message: "Empty title is not allowed for `describe`.", type: "CallExpression"}]
    },
    {
      code:
        "describe('\t', function () {" +
          "it('some title', function () {});" +
        "});",
      errors: [{message: "Empty title is not allowed for `describe`.", type: "CallExpression"}]
    },
    {
      code: "it.skip('', function () {});",
      errors: [{message: "Empty title is not allowed for `it`.", type: "CallExpression"}]
    },
    {
      code: "it.skip('   ', function () {});",
      errors: [{message: "Empty title is not allowed for `it`.", type: "CallExpression"}]
    },
    {
      code: "it.skip('\t', function () {});",
      errors: [{message: "Empty title is not allowed for `it`.", type: "CallExpression"}]
    },
    {
      code:
        "describe.skip('', function () {" +
          "it('some title', function () {});" +
        "});",
      errors: [{message: "Empty title is not allowed for `describe`.", type: "CallExpression"}]
    },
    {
      code:
        "describe.skip('   ', function () {" +
          "it('some title', function () {});" +
        "});",
      errors: [{message: "Empty title is not allowed for `describe`.", type: "CallExpression"}]
    },
    {
      code:
        "describe.skip('\t', function () {" +
          "it('some title', function () {});" +
        "});",
      errors: [{message: "Empty title is not allowed for `describe`.", type: "CallExpression"}]
    }
  ]
});