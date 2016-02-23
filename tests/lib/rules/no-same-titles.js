"use strict";

var rule = require("../../../lib/rules/no-same-titles"),
  RuleTester = require("eslint").RuleTester;
var testHelpers = require("../../../lib/utils/tests.js");
var ruleTester = new RuleTester();

var Jsonium = require('jsonium');
var j = new Jsonium();

var m = "Some tests have same titles.";

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
      "});",
    options: [{scope: "suite"}]
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
      "{{TEST}}('123', function (){}); " +
      "{{SUITE}}('321', function () {" +
        "{{TEST}}('123', function (){});" +
        "{{SUITE}}('321', function () {" +
          "{{TEST}}('123', function (){});" +
        "});" +
      "});",
    options: [{scope: "suite"}]
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
      "{{SUITE}}('321', function () {" +
        "{{TEST}}('123', function (){});" +
      "}); " +
      "{{SUITE}}('4321', function () {" +
        "{{TEST}}('123', function (){});" +
      "});",
    options: [{scope: "suite"}]
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
        "{{TEST}}('1234', function () {}); " +
        "{{TEST}}('1234', function () {}); " +
      "});",
    options: [{skipSkipped: true, scope: "suite"}]
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
  },
  {
    code:
      "{{SUITESKIP}}('4321', function () { " +
        "{{SUITE}}('4321', function () { " +
          "{{TEST}}('1234', function () {}); " +
          "{{TEST}}('1234', function () {}); " +
        "});" +
      "});",
    options: [{skipSkipped: true, scope: "suite"}]
  },
  {
    code:
      "{{TEST}}('1111', function (){}); " +
        "{{SUITE}}('321', function () {" +
          "{{TEST}}('123', function (){});" +
          "{{SUITESKIP}}('321', function () {" +
            "{{TEST}}('123', function (){});" +
        "});" +
      "});",
    options: [{scope: "file", skipSkipped: true}]
  }
];

var invalidTestTemplates = [
  {
    code:
      "{{SUITE}}('4321', function () { " +
        "{{TEST}}('1234', function () {}); " +
        "{{TEST}}('1234', function () {}); " +
      "});",
    errors: [
      {message: m, type: "CallExpression"},
      {message: m, type: "CallExpression"}
    ]
  },
  {
    code:
      "{{SUITESKIP}}('4321', function () { " +
        "{{TEST}}('1234', function () {}); " +
        "{{TEST}}('1234', function () {}); " +
      "});",
    errors: [
      {message: m, type: "CallExpression"},
      {message: m, type: "CallExpression"}
    ]
  },
  {
    code:
      "{{SUITESKIP}}('4321', function () { " +
        "{{SUITE}}('4321', function () { " +
          "{{TEST}}('1234', function () {}); " +
          "{{TEST}}('1234', function () {}); " +
        "});" +
      "});",
    errors: [
      {message: m, type: "CallExpression"},
      {message: m, type: "CallExpression"}
    ]
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
    errors: [
      {message: m, type: "CallExpression"},
      {message: m, type: "CallExpression"}
    ]
  },
  {
    code:
      "{{TEST}}('1111', function (){}); " +
        "{{SUITE}}('321', function () {" +
          "{{TEST}}('123', function (){});" +
          "{{SUITE}}('321', function () {" +
            "{{TEST}}('123', function (){});" +
          "});" +
        "});",
    options: [{scope: "file"}],
    errors: [
      {message: m, type: "CallExpression"},
      {message: m, type: "CallExpression"}
    ]
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