"use strict";

var rule = require("../../../lib/rules/no-empty-body"),
  RuleTester = require("eslint").RuleTester;
var testHelpers = require("../../../lib/utils/tests.js");
var ruleTester = new RuleTester();

var Jsonium = require('jsonium');
var j = new Jsonium();

var msg = "Empty function is not allowed here.";
var hooks = [
  {HO: "before(function () {", OK: "});"},
  {HO: "beforeEach(function () {", OK: "});"},
  {HO: "after(function () {", OK:"});"},
  {HO: "afterEach(function () {", OK:"});"},
  {HO: "before('12345', function () {", OK: "});"},
  {HO: "beforeEach('12345', function () {", OK: "});"},
  {HO: "after('12345', function () {", OK:"});"},
  {HO: "afterEach('12345', function () {", OK:"});"}
];
var emptyBodies = [
  {BODY: ""},
  {BODY: "/* some comment */"},
  {BODY: "// some comment\n"}
];

var validTestTemplates = [
  {
    code:
      "{{SUITESKIP}}('1234', function () {{{BODY}}});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{TEST}}('4321', function () {" +
          "{{BODY}}" +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "{{TESTSKIP}}('4321', function () {" +
          "{{BODY}}" +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {{{HO}} {{BODY}} {{OK}}});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{SUITE}}('1234', function () {" +
          "{{HO}} {{BODY}} {{OK}}" +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  }
];

var invalidTestTemplates = [
  {
    code:
      "{{SUITE}}('1234', function () {{{BODY}}});",
    errors: [
      {message: msg}
    ]
  },
  {
    code:
      "{{SUITE}}('1234', function () {{{HO}} {{BODY}} {{OK}}});",
    errors: [
      {message: msg}
    ]
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "{{SUITE}}('1234', function () {" +
          "{{HO}} {{BODY}} {{OK}}" +
        "});" +
      "});",
    errors: [
      {message: msg}
    ]
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "{{SUITE}}('1234', function () {" +
          "{{HO}} {{BODY}} {{OK}}" +
        "});" +
        "{{SUITE}}('1234', function () {" +
          "{{BODY}}" +
        "});" +
      "});",
    errors: [
      {message: msg},
      {message: msg}
    ]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {{{BODY}}});",
    errors: [
      {message: msg}
    ]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{TEST}}('4321', function () {" +
          "{{BODY}}" +
        "});" +
      "});",
    errors: [
      {message: msg}
    ]
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "{{TESTSKIP}}('4321', function () {" +
          "{{BODY}}" +
        "});" +
      "});",
    errors: [
      {message: msg}
    ]
  }
];

var validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(['code'], emptyBodies)
  .useCombosAsTemplates()
  .createCombos(['code'], hooks)
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.mochaDatasets)
  .uniqueCombos()
  .getCombos();

j.clearTemplates().clearCombos();

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(['code'], emptyBodies)
  .useCombosAsTemplates()
  .createCombos(['code'], hooks)
  .useCombosAsTemplates()
  .createCombos(['code', 'errors.0.message', 'errors.1.message'], testHelpers.mochaDatasets)
  .uniqueCombos()
  .getCombos();


ruleTester.run("no-empty-body", rule, {
  valid: validTests,
  invalid: invalidTests
});