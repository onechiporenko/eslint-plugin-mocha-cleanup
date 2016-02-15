"use strict";

var rule = require("../../../lib/rules/no-same-titles"),
  RuleTester = require("eslint").RuleTester;
var testHelpers = require("../../../lib/utils/tests.js");
var ruleTester = new RuleTester();

var Jsonium = require('jsonium');
var j = new Jsonium();

var validTestTemplates = [
  {
    code:
      "{{TEST}}('123', function (){}); " +
      "{{SUITE}}('321', function () {" +
        "{{TEST}}('123', function (){});" +
      "});"
  },
  {
    code:
      "{{TEST}}('123', function (){}); " +
      "{{SUITE}}('321', function () {" +
        "{{TEST}}('123', function (){});" +
        "{{SUITE}}('321', function () {" +
          "{{TEST}}('123', function (){});" +
        "});" +
      "});"
  },
  {
    code:
      "{{SUITE}}('321', function () {" +
        "{{TEST}}('123', function (){});" +
      "}); " +
      "{{SUITE}}('4321', function () {" +
        "{{TEST}}('123', function (){});" +
      "});"
  },
  {
    code:
      "{{SUITESKIP}}('4321', function () { " +
        "{{TEST}}('1234', function () {}); " +
        "{{TEST}}('1234', function () {}); " +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITESKIP}}('4321', function () { " +
        "{{SUITE}}('4321', function () { " +
          "{{TEST}}('1234', function () {}); " +
          "{{TEST}}('1234', function () {}); " +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  }
];

var invalidTestTemplates = [
  {
    code:
      "{{SUITE}}('4321', function () { " +
        "{{TEST}}('1234', function () {}); " +
        "{{TEST}}('1234', function () {}); " +
      "});",
    errors: [{message: "Some tests have same titles.", type: "CallExpression"}]
  },
  {
    code:
      "{{SUITESKIP}}('4321', function () { " +
        "{{TEST}}('1234', function () {}); " +
        "{{TEST}}('1234', function () {}); " +
      "});",
    errors: [{message: "Some tests have same titles.", type: "CallExpression"}]
  },
  {
    code:
      "{{SUITESKIP}}('4321', function () { " +
        "{{SUITE}}('4321', function () { " +
          "{{TEST}}('1234', function () {}); " +
          "{{TEST}}('1234', function () {}); " +
        "});" +
      "});",
    errors: [{message: "Some tests have same titles.", type: "CallExpression"}]
  },
  {
    code:
      "{{TEST}}('1111', function (){}); " +
        "{{SUITE}}('321', function () {" +
          "{{TEST}}('123', function (){});" +
          "{{SUITE}}('321', function () {" +
            "{{TEST}}('123', function (){});" +
            "{{TEST}}('123', function (){});" +
          "});" +
        "});",
    errors: [{message: "Some tests have same titles.", type: "CallExpression"}]
  }
];

var validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(['code'], testHelpers.mochaDatasets)
  .uniqueCombos()
  .getCombos();

j.clearTemplates().clearCombos();

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(['code', 'errors.@each.message'], testHelpers.mochaDatasets)
  .uniqueCombos()
  .getCombos();


ruleTester.run("no-same-title", rule, {
  valid: validTests,
  invalid: invalidTests
});