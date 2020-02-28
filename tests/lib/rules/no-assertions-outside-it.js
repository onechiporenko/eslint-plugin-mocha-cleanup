"use strict"

const rule = require("../../../lib/rules/no-assertions-outside-it")
const RuleTester = require("eslint").RuleTester

const ruleTester = new RuleTester({ env: { es6: true } })

const testHelpers = require("../../../lib/utils/tests.js")

const Jsonium = require("jsonium")
const j = new Jsonium()

const asserts = [
  { ASSERT: "expect(1).to.be.equal(1);", TYPE: "MemberExpression" },
  { ASSERT: "'1'.should.equal('1');", TYPE: "MemberExpression" },
  { ASSERT: "'1'['should'].equal('1');", TYPE: "MemberExpression" },
  { ASSERT: "assert.equal(1, 1);", TYPE: "CallExpression" },
  { ASSERT: "assert(1, 1);", TYPE: "ExpressionStatement" },
  { ASSERT: "sinon.assert.calledOn(sp, {});", TYPE: "MemberExpression" },
  { ASSERT: "sinon['assert'].calledOn(sp, {});", TYPE: "MemberExpression" }
]

const validTestTemplates = [
  {
    code:
      "{{TEST}}('1234', {{ES}}" +
        "{{ASSERT}}" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "assert;" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "should;" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "should();" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "expect;" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "var expect = {};" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "var should = {};" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "var assert = {};" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "var a = {{ES}} " +
          "{{ASSERT}} " +
        "}" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "function a () {" +
          "{{ASSERT}} " +
        "}" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "var a = {{ES}} " +
          "[].forEach({{ES}}" +
            "{{ASSERT}}" +
          "});" +
        "}" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "function a () {" +
          "[].forEach({{ES}}" +
            "{{ASSERT}}" +
          "});" +
        "}" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "var a = {{ES}} " +
          "[].forEach({{ES}}" +
            "[].forEach({{ES}}" +
              "{{ASSERT}}" +
            "});" +
          "});" +
        "}" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "function a () {" +
          "[].forEach({{ES}}" +
            "[].forEach({{ES}}" +
              "{{ASSERT}}" +
            "});" +
          "});" +
        "}" +
      "});"
  },
  {
    code:
      "var a = {{ES}} " +
        "{{ASSERT}} " +
      "}"
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{ASSERT}}" +
      "});",
    options: [{ skipSkipped: true }]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{TEST}}('321', {{ES}}});" +
        "{{ASSERT}}" +
      "});",
    options: [{ skipSkipped: true }]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{ASSERT}}" +
      "});",
    options: [{ skipSkipped: true }]
  }
]

const invalidTestTemplates = [
  {
    code:
      "{{ASSERT}}",
    errors: [
      { message: "Assertion outside tests is not allowed.", type: "{{TYPE}}" }
    ]
  },
  {
    code:
      "{{ASSERT}}" +
      "{{ASSERT}}",
    errors: [
      { message: "Assertion outside tests is not allowed.", type: "{{TYPE}}" },
      { message: "Assertion outside tests is not allowed.", type: "{{TYPE}}" }
    ]
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "{{ASSERT}}" +
      "});",
    errors: [
      { message: "Assertion outside tests is not allowed.", type: "{{TYPE}}" }
    ]
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "[].forEach({{ES}}" +
          "{{ASSERT}}" +
        "});" +
      "});",
    errors: [
      { message: "Assertion outside tests is not allowed.", type: "{{TYPE}}" }
    ]
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "[].forEach({{ES}}" +
          "[].forEach({{ES}}" +
            "{{ASSERT}}" +
         "});" +
        "});" +
      "});",
    errors: [
      { message: "Assertion outside tests is not allowed.", type: "{{TYPE}}" }
    ]
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "{{TEST}}('321', {{ES}}});" +
        "{{ASSERT}}" +
      "});",
    errors: [
      { message: "Assertion outside tests is not allowed.", type: "{{TYPE}}" }
    ]
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "{{ASSERT}}" +
        "{{ASSERT}}" +
        "{{ASSERT}}" +
        "{{ASSERT}}" +
      "});",
    errors: [
      { message: "Assertion outside tests is not allowed.", type: "{{TYPE}}" },
      { message: "Assertion outside tests is not allowed.", type: "{{TYPE}}" },
      { message: "Assertion outside tests is not allowed.", type: "{{TYPE}}" },
      { message: "Assertion outside tests is not allowed.", type: "{{TYPE}}" }
    ]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{TEST}}('321', {{ES}}});" +
        "{{ASSERT}}" +
      "});",
    errors: [
      { message: "Assertion outside tests is not allowed.", type: "{{TYPE}}" }
    ]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{ASSERT}}" +
      "});",
    errors: [
      { message: "Assertion outside tests is not allowed.", type: "{{TYPE}}" }
    ]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{ASSERT}}" +
        "{{ASSERT}}" +
        "{{ASSERT}}" +
        "{{ASSERT}}" +
      "});",
    errors: [
      { message: "Assertion outside tests is not allowed.", type: "{{TYPE}}" },
      { message: "Assertion outside tests is not allowed.", type: "{{TYPE}}" },
      { message: "Assertion outside tests is not allowed.", type: "{{TYPE}}" },
      { message: "Assertion outside tests is not allowed.", type: "{{TYPE}}" }
    ]
  }
]

const validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], asserts)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .uniqueCombos()
  .getCombos()

j.clearTemplates().clearCombos()

const invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code", "errors.@each.type"], asserts)
  .useCombosAsTemplates()
  .createCombos(["code", "errors.@each.message"], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .uniqueCombos()
  .getCombos()

ruleTester.run("no-assertions-outside-it", rule, {
  valid: validTests,
  invalid: invalidTests
})
