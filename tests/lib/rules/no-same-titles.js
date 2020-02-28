"use strict";

var rule = require("../../../lib/rules/no-same-titles"),
  RuleTester = require("eslint").RuleTester;
var testHelpers = require("../../../lib/utils/tests.js");
var ruleTester = new RuleTester({env: {es6: true}});

var Jsonium = require("jsonium");
var j = new Jsonium();

var m = "Some tests have same titles.";

var validTestTemplates = [
  {
    code:
      "{{TEST}}('123', {{ES}}}); " +
      "{{SUITE}}('321', {{ES}}" +
        "{{TEST}}('123', {{ES}}});" +
      "});"
  },
  {
    code:
      "{{TEST}}('123', {{ES}}}); " +
      "{{SUITE}}('321', {{ES}}" +
        "{{TEST}}('123', {{ES}}});" +
      "});",
    options: [{scope: "suite"}]
  },
  {
    code:
      "{{TEST}}('123', {{ES}}}); " +
      "{{SUITE}}('321', {{ES}}" +
        "{{TEST}}('123', {{ES}}});" +
        "{{SUITE}}('321', {{ES}}" +
          "{{TEST}}('123', {{ES}}});" +
        "});" +
      "});"
  },
  {
    code:
      "{{TEST}}('123', {{ES}}}); " +
      "{{SUITE}}('321', {{ES}}" +
        "{{TEST}}('123', {{ES}}});" +
        "{{SUITE}}('321', {{ES}}" +
          "{{TEST}}('123', {{ES}}});" +
        "});" +
      "});",
    options: [{scope: "suite"}]
  },
  {
    code:
      "{{SUITE}}('321', {{ES}}" +
        "{{TEST}}('123', {{ES}}});" +
      "}); " +
      "{{SUITE}}('4321', {{ES}}" +
        "{{TEST}}('123', {{ES}}});" +
      "});"
  },
  {
    code:
      "{{SUITE}}('321', {{ES}}" +
        "{{TEST}}('123', {{ES}}});" +
      "}); " +
      "{{SUITE}}('4321', {{ES}}" +
        "{{TEST}}('123', {{ES}}});" +
      "});",
    options: [{scope: "suite"}]
  },
  {
    code:
      "{{SUITESKIP}}('4321', {{ES}} " +
        "{{TEST}}('1234', {{ES}}}); " +
        "{{TEST}}('1234', {{ES}}}); " +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITESKIP}}('4321', {{ES}} " +
        "{{TEST}}('1234', {{ES}}}); " +
        "{{TEST}}('1234', {{ES}}}); " +
      "});",
    options: [{skipSkipped: true, scope: "suite"}]
  },
  {
    code:
      "{{SUITESKIP}}('4321', {{ES}} " +
        "{{SUITE}}('4321', {{ES}} " +
          "{{TEST}}('1234', {{ES}}}); " +
          "{{TEST}}('1234', {{ES}}}); " +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITESKIP}}('4321', {{ES}} " +
        "{{SUITE}}('4321', {{ES}} " +
          "{{TEST}}('1234', {{ES}}}); " +
          "{{TEST}}('1234', {{ES}}}); " +
        "});" +
      "});",
    options: [{skipSkipped: true, scope: "suite"}]
  },
  {
    code:
      "{{TEST}}('1111', {{ES}}}); " +
        "{{SUITE}}('321', {{ES}}" +
          "{{TEST}}('123', {{ES}}});" +
          "{{SUITESKIP}}('321', {{ES}}" +
            "{{TEST}}('123', {{ES}}});" +
        "});" +
      "});",
    options: [{scope: "file", skipSkipped: true}]
  },
  {
    code:
      "{{SUITE}}('4321', {{ES}} " +
        "{{TEST}}(foo, {{ES}}}); " +
      "});"
  }
];

var invalidTestTemplates = [
  {
    code:
      "{{SUITE}}('4321', {{ES}} " +
        "{{TEST}}('1234', {{ES}}}); " +
        "{{TEST}}('1234', {{ES}}}); " +
      "});",
    errors: [
      {message: m, type: "CallExpression"},
      {message: m, type: "CallExpression"}
    ]
  },
  {
    code:
      "{{SUITESKIP}}('4321', {{ES}} " +
        "{{TEST}}('1234', {{ES}}}); " +
        "{{TEST}}('1234', {{ES}}}); " +
      "});",
    errors: [
      {message: m, type: "CallExpression"},
      {message: m, type: "CallExpression"}
    ]
  },
  {
    code:
      "{{SUITESKIP}}('4321', {{ES}} " +
        "{{SUITE}}('4321', {{ES}} " +
          "{{TEST}}('1234', {{ES}}}); " +
          "{{TEST}}('1234', {{ES}}}); " +
        "});" +
      "});",
    errors: [
      {message: m, type: "CallExpression"},
      {message: m, type: "CallExpression"}
    ]
  },
  {
    code:
      "{{TEST}}('1111', {{ES}}}); " +
        "{{SUITE}}('321', {{ES}}" +
          "{{TEST}}('123', {{ES}}});" +
          "{{SUITE}}('321', {{ES}}" +
            "{{TEST}}('constructor', {{ES}}});" +
            "{{TEST}}('constructor', {{ES}}});" +
          "});" +
        "});",
    errors: [
      {message: m, type: "CallExpression"},
      {message: m, type: "CallExpression"}
    ]
  },
  {
    code:
      "{{TEST}}('1111', {{ES}}}); " +
        "{{SUITE}}('321', {{ES}}" +
          "{{TEST}}('123', {{ES}}});" +
          "{{SUITE}}('321', {{ES}}" +
            "{{TEST}}('123', {{ES}}});" +
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
  .createCombos(["code"], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .uniqueCombos()
  .getCombos();

j.clearTemplates().clearCombos();

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code", "errors.@each.message"], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .uniqueCombos()
  .getCombos();


ruleTester.run("no-same-title", rule, {
  valid: validTests,
  invalid: invalidTests
});
