"use strict";

var rule = require("../../../lib/rules/no-same-titles"),
  RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();
ruleTester.run("no-same-title", rule, {
  valid: [
    "it('123', function (){}); " +
    "describe('321', function () {" +
      "it('123', function (){});" +
    "});",

    "describe('321', function () {" +
      "it('123', function (){});" +
    "}); " +
    "describe('4321', function () {" +
      "it('123', function (){});" +
    "});",

    "describe('4321', function () {" +
      "describe('321', function () {" +
        "it('123', function (){});" +
      "}); " +
      "it('123', function (){});" +
    "});",
    {
      code:
        "describe.skip('4321', function () { " +
          "it('1234', function () {}); " +
          "it('1234', function () {}); " +
        "});",
      options: [true]
    },
    {
      code:
        "describe.skip('4321', function () { " +
          "describe('4321', function () { " +
            "it('1234', function () {}); " +
            "it('1234', function () {}); " +
          "});" +
        "});",
      options: [true]
    }
  ],

  invalid: [
    {
      code:
        "describe('4321', function () { " +
          "it('1234', function () {}); " +
          "it('1234', function () {}); " +
        "});",
      errors: [{message: "Some `it` have same titles.", type: "CallExpression"}]
    },
    {
      code:
        "describe.skip('4321', function () { " +
          "it('1234', function () {}); " +
          "it('1234', function () {}); " +
        "});",
      errors: [{message: "Some `it` have same titles.", type: "CallExpression"}]
    },
    {
      code:
        "describe.skip('4321', function () { " +
          "describe('4321', function () { " +
            "it('1234', function () {}); " +
            "it('1234', function () {}); " +
          "});" +
        "});",
      errors: [{message: "Some `it` have same titles.", type: "CallExpression"}]
    }
  ]
});