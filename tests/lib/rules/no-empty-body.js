"use strict";

var rule = require("../../../lib/rules/no-empty-body"),
  RuleTester = require("eslint").RuleTester;
var testHelpers = require("../../../lib/utils/tests.js");
var ruleTester = new RuleTester({env: {es6: true}});

var Jsonium = require("jsonium");
var j = new Jsonium();

var msg = "Empty function is not allowed here.";
var hooks = [
  {HO: "before({{ES}}", OK: "});"},
  {HO: "beforeEach({{ES}}", OK: "});"},
  {HO: "after({{ES}}", OK:"});"},
  {HO: "afterEach({{ES}}", OK:"});"},
  {HO: "before('12345', {{ES}}", OK: "});"},
  {HO: "beforeEach('12345', {{ES}}", OK: "});"},
  {HO: "after('12345', {{ES}}", OK:"});"},
  {HO: "afterEach('12345', {{ES}}", OK:"});"}
];
var emptyBodies = [
  {BODY: ""},
  {BODY: "/* some comment */"},
  {BODY: "// some comment\n"}
];

var validTestTemplates = [
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}{{BODY}}});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{TEST}}('4321', {{ES}}" +
          "{{BODY}}" +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "{{TESTSKIP}}('4321', {{ES}}" +
          "{{BODY}}" +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}{{HO}} {{BODY}} {{OK}}});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{SUITE}}('1234', {{ES}}" +
          "{{HO}} {{BODY}} {{OK}}" +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  }
];

var invalidTestTemplates = [
  {
    code:
      "{{SUITE}}('1234', {{ES}}{{BODY}}});",
    errors: [
      {message: msg}
    ]
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}{{HO}} {{BODY}} {{OK}}});",
    errors: [
      {message: msg}
    ]
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "{{SUITE}}('1234', {{ES}}" +
          "{{HO}} {{BODY}} {{OK}}" +
        "});" +
      "});",
    errors: [
      {message: msg}
    ]
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "{{SUITE}}('1234', {{ES}}" +
          "{{HO}} {{BODY}} {{OK}}" +
        "});" +
        "{{SUITE}}('1234', {{ES}}" +
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
      "{{SUITESKIP}}('1234', {{ES}}{{BODY}}});",
    errors: [
      {message: msg}
    ]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{TEST}}('4321', {{ES}}" +
          "{{BODY}}" +
        "});" +
      "});",
    errors: [
      {message: msg}
    ]
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "{{TESTSKIP}}('4321', {{ES}}" +
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
  .createCombos(["code"], emptyBodies)
  .useCombosAsTemplates()
  .createCombos(["code"], hooks)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .uniqueCombos()
  .getCombos();

j.clearTemplates().clearCombos();

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], emptyBodies)
  .useCombosAsTemplates()
  .createCombos(["code"], hooks)
  .useCombosAsTemplates()
  .createCombos(["code", "errors.@each.message"], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .uniqueCombos()
  .getCombos();


ruleTester.run("no-empty-body", rule, {
  valid: validTests,
  invalid: invalidTests
});