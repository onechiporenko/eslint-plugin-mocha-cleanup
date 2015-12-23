"use strict";

var rule = require("../../../lib/rules/no-nested-it"),
  RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();
ruleTester.run("no-nested-it", rule, {
  valid: [
    "it('123', function (){}); " +
    "describe('321', function () {" +
      " it('123', function (){});" +
    "});",

    "describe('321', function () {" +
      "it('123', function (){" +
        "some.it;" +
      "});" +
    "});",

    "describe('321', function () {" +
      "it('123', function (){" +
        "it.abc();" +
      "});" +
    "});",

    "describe('321', function () {" +
      "it('123', function (){" +
        "abc.it();" +
      "});" +
    "});",

    "describe('321', function () {" +
      "it('123', function (){" +
        "abc.it('33', function () {});" +
      "});" +
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
    "});"
  ],

  invalid: [
    {
      code:
        "describe('1234', function () { " +
          "it('1234', function () { " +
            "it('4321', function () {}); " +
          "});" +
        "});",
      errors: [{message: "Nested `it` is not allowed.", type: "CallExpression"}]
    }
  ]
});