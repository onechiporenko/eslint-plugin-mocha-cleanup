"use strict";

var rule = require("../../../lib/rules/invalid-assertions"),
  RuleTester = require("eslint").RuleTester;
var testHelpers = require("../../../lib/utils/tests.js");
var n = require("../../../lib/utils/node.js");
var m = "Invalid assertion usage.";
var ruleTester = new RuleTester();

var Jsonium = require('jsonium');
var j = new Jsonium();

var chains = n.chaiChainable.map(function (c) {
  return {CHAIN: "." + c};
});

chains.push({CHAIN: ""});

var assertions = [
  {ASSERTION: "expect(1){{CHAIN}};", TYPE: "CallExpression"},
  {ASSERTION: "'1'.should{{CHAIN}};", TYPE: "MemberExpression"},
  {ASSERTION: "'1'['should']{{CHAIN}};", TYPE: "MemberExpression"}
];

assertions = j
  .setTemplates(assertions)
  .createCombos("ASSERTION", chains)
  .uniqueCombos()
  .getCombos();

var validTestTemplates = [
  {
    code:
      "{{ASSERTION}}"
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "{{ASSERTION}}" +
        "{{TEST}}('4321', function () {" +
        "})" +
      "})"
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "{{TESTSKIP}}('4321', function () {" +
          "{{ASSERTION}}" +
        "})" +
      "})",
    options: [
      {skipSkipped: true}
    ]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{TEST}}('4321', function () {" +
          "{{ASSERTION}}" +
        "})" +
      "})",
    options: [
      {skipSkipped: true}
    ]
  }
];

var invalidTestTemplates = [
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "{{TEST}}('4321', function () {" +
          "{{ASSERTION}}" +
        "})" +
      "})",
    errors: [
      {message: m, type: "{{TYPE}}"}
    ]
  }
];

var validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], assertions)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.mochaDatasets)
  .uniqueCombos()
  .getCombos();

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code", "errors.@each.type"], assertions)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.mochaDatasets)
  .uniqueCombos()
  .getCombos();

ruleTester.run("invalid-assertions", rule, {
  valid: validTests,
  invalid: invalidTests
});