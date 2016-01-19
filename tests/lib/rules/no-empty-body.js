"use strict";

var rule = require("../../../lib/rules/no-empty-body"),
  RuleTester = require("eslint").RuleTester;
var testHelpers = require("../../../lib/utils/tests.js");
var ruleTester = new RuleTester();

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
      "SUITESKIP('1234', function () {BODY});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        "TEST('4321', function () {" +
          "BODY" +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITE('1234', function () {" +
        "TESTSKIP('4321', function () {" +
          "BODY" +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITESKIP('1234', function () {HO BODY OK});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        "SUITE('1234', function () {" +
          "HO BODY OK" +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  }
];

var invalidTestTemplates = [
  {
    code:
      "SUITE('1234', function () {BODY});",
    errors: [
      {message: msg}
    ]
  },
  {
    code:
      "SUITE('1234', function () {HO BODY OK});",
    errors: [
      {message: msg}
    ]
  },
  {
    code:
      "SUITE('1234', function () {" +
        "SUITE('1234', function () {" +
          "HO BODY OK" +
        "});" +
      "});",
    errors: [
      {message: msg}
    ]
  },
  {
    code:
      "SUITE('1234', function () {" +
        "SUITE('1234', function () {" +
          "HO BODY OK" +
        "});" +
        "SUITE('1234', function () {" +
          "BODY" +
        "});" +
      "});",
    errors: [
      {message: msg},
      {message: msg}
    ]
  },
  {
    code:
      "SUITESKIP('1234', function () {BODY});",
    errors: [
      {message: msg}
    ]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        "TEST('4321', function () {" +
          "BODY" +
        "});" +
      "});",
    errors: [
      {message: msg}
    ]
  },
  {
    code:
      "SUITE('1234', function () {" +
        "TESTSKIP('4321', function () {" +
          "BODY" +
        "});" +
      "});",
    errors: [
      {message: msg}
    ]
  }
];

ruleTester.run("no-empty-body", rule, {
  valid: testHelpers.getCombos(testHelpers.getCombos(testHelpers.getCombos(validTestTemplates, emptyBodies), hooks)),
  invalid: testHelpers.getCombos(testHelpers.getCombos(testHelpers.getCombos(invalidTestTemplates, emptyBodies), hooks))
});