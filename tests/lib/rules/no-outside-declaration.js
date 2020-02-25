"use strict";

var rule = require("../../../lib/rules/no-outside-declaration"),
  RuleTester = require("eslint").RuleTester;
var testHelpers = require("../../../lib/utils/tests.js");
var ruleTester = new RuleTester({env: {es6: true}});

var Jsonium = require("jsonium");
var j = new Jsonium();

var m = "Variable declaration is not allowed outside tests and hooks.";

var declarations = [
  {DECLARATION: "var a = require('abc');"},
  {DECLARATION: "let b = a + c;"},
  {DECLARATION: "const c = 1;"},
  {DECLARATION: "const {e, f, g} = d;"}
];

var validTestTemplates = [
  {
    code:
      "{{DECLARATION}}" +
      "{{SUITE}}('1234', {{ES}} " +
        "{{TEST}}('4321', {{ES}}}); " +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}} " +
        "{{HOOK}}({{ES}}" +
          "{{DECLARATION}}" +
        "});" +
        "{{TEST}}('4321', {{ES}}}); " +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}} " +
        "{{TEST}}('4321', {{ES}}" +
          "{{DECLARATION}}" +
        "}); " +
      "});"
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}} " +
        "{{DECLARATION}}" +
        "{{TEST}}('4321', {{ES}}}); " +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}} " +
        "{{TEST}}('4321', {{ES}}}); " +
        "{{DECLARATION}}" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}} " +
        "{{HOOK}}({{ES}}});" +
        "{{DECLARATION}}" +
        "{{TEST}}('4321', {{ES}}}); " +
      "});",
    options: [{skipSkipped: true}]
  }
];

var invalidTestTemplates = [
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}} " +
        "{{DECLARATION}}" +
        "{{TEST}}('4321', {{ES}}}); " +
      "});",
    errors: [
      {message: m, type: "VariableDeclaration"}
    ]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}} " +
        "{{TEST}}('4321', {{ES}}}); " +
        "{{DECLARATION}}" +
      "});",
    errors: [
      {message: m, type: "VariableDeclaration"}
    ]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}} " +
        "{{HOOK}}({{ES}}});" +
        "{{DECLARATION}}" +
        "{{TEST}}('4321', {{ES}}}); " +
      "});",
    errors: [
      {message: m, type: "VariableDeclaration"}
    ]
  }
];

var validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.hooks)
  .useCombosAsTemplates()
  .createCombos(["code"], declarations)
  .uniqueCombos()
  .getCombos();

j.clearTemplates().clearCombos();

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.hooks)
  .useCombosAsTemplates()
  .createCombos(["code"], declarations)
  .uniqueCombos()
  .getCombos();

ruleTester.run("no-outside-declaration", rule, {
  valid: validTests,
  invalid: invalidTests
});
