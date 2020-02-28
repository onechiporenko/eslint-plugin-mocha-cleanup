"use strict"

const testHelpers = require("../../../lib/utils/tests.js")
const Jsonium = require("jsonium")
const j = new Jsonium()

const rule = require("../../../lib/rules/complexity-it")
const { RuleTester } = require("eslint")

const ruleTester = new RuleTester({ env: { es6: true } })

const assertions = [
  { ASSERT: "sinon.assert.calledOn(sp, {});", COMPLEXITY: "3" },
  { ASSERT: "expect(func()).to.be.equal(1);", COMPLEXITY: "4" },
  { ASSERT: "assert.equal(func(), 1, '4321');", COMPLEXITY: "3" },
  { ASSERT: "assert(func(), 1, '4321');", COMPLEXITY: "3" },
  { ASSERT: "func().should.be.equal(1);", COMPLEXITY: "4" }
]

const validTestTemplates = [
  {
    code:
      "{{SUITE}}('3421', {{ES}}" +
        "{{TEST}}('1234', {{ES}}" +
          "var result = myObj.mySubObj.coolFunc(1, 2);" +
          "var expected = myTestCase.expected[0];" +
          "expect(result).to.be.equal(expected);" +
        "});" +
      "});"
  },
  {
    code:
      "{{SUITE}}('3421', {{ES}}" +
        "{{TEST}}('1234', {{ES}}" +
          "var result = myObj.mySubObj.coolFunc(1, 2);" +
          "var expected = myTestCase.expected[0];" +
          "expect(result).to.be.equal(expected);" +
        "});" +
      "});",
    options: [{ maxAllowedComplexity: 6 }]
  },
  {
    code:
      "{{SUITE}}('3421', {{ES}}" +
        "{{TEST}}('1234', {{ES}}" +
          "var result = myObj.coolFunc(1, 2);" +
          "var expected = myTestCase.expected[0];" +
          "expect(result).to.be.equal(expected);" +
        "});" +
      "});",
    options: [{ maxAllowedComplexity: 9 }]
  },
  {
    code:
      "{{SUITESKIP}}('3421', {{ES}}" +
        "{{TEST}}('1234', {{ES}} " +
          "{{ASSERT}}" +
        "});" +
      "});",
    options: [{ maxAllowedComplexity: 0, skipSkipped: true }]
  },
  {
    code:
      "{{TESTSKIP}}('1234', {{ES}} " +
        "{{ASSERT}}" +
      "});",
    options: [{ maxAllowedComplexity: 0, skipSkipped: true }]
  },
  {
    code:
      "{{SUITESKIP}}('3421', {{ES}}" +
        "{{TEST}}('1234', {{ES}} " +
          "{{ASSERT}}" +
        "});" +
      "});",
    options: [{ maxAllowedComplexity: 0, skipSkipped: true }]
  },
  {
    code:
      "{{TESTSKIP}}('1234', {{ES}} " +
        "expect(func()).to.be.been.is.that.which.and.has.have.with.at.of.same.equal(1);" +
      "});",
    options: [{ maxAllowedComplexity: 0, skipSkipped: true }]
  },
  {
    code:
      "{{SUITESKIP}}('4321', {{ES}}" +
        "{{TEST}}('1234', {{ES}} " +
          "expect(func()).to.be.been.is.that.which.and.has.have.with.at.of.same.equal(1);" +
        "});" +
      "});",
    options: [{ maxAllowedComplexity: 0, skipSkipped: true }]
  }
]

const invalidTestTemplates = [
  {
    code:
      "{{TEST}}('1234', {{ES}} " +
        "{{ASSERT}}" +
      "});",
    options: [{ maxAllowedComplexity: 0 }],
    errors: [{ message: "`{{TEST}}` has a complexity of {{COMPLEXITY}}. Maximum allowed is 0.", type: "CallExpression" }]
  },
  {
    code:
      "{{SUITESKIP}}('4321', {{ES}}" +
        "{{TEST}}('1234', {{ES}} " +
          "{{ASSERT}}" +
        "});" +
      "});",
    options: [{ maxAllowedComplexity: 0 }],
    errors: [{ message: "`{{TEST}}` has a complexity of {{COMPLEXITY}}. Maximum allowed is 0.", type: "CallExpression" }]
  },
  {
    code:
      "{{TESTSKIP}}('1234', {{ES}} " +
        "{{ASSERT}}" +
      "});",
    options: [{ maxAllowedComplexity: 0 }],
    errors: [{ message: "`{{TESTSKIP}}` has a complexity of {{COMPLEXITY}}. Maximum allowed is 0.", type: "CallExpression" }]
  },
  {
    code:
      "{{TEST}}('1234', {{ES}} " +
        "expect(func()).to.be.been.is.that.which.and.has.have.with.at.of.same.equal(1);" +
      "});",
    options: [{ maxAllowedComplexity: 0 }],
    errors: [{ message: "`{{TEST}}` has a complexity of 4. Maximum allowed is 0.", type: "CallExpression" }]
  },
  {
    code:
      "{{TESTSKIP}}('1234', {{ES}} " +
        "expect(func()).to.be.been.is.that.which.and.has.have.with.at.of.same.equal(1);" +
      "});",
    options: [{ maxAllowedComplexity: 0 }],
    errors: [{ message: "`{{TESTSKIP}}` has a complexity of 4. Maximum allowed is 0.", type: "CallExpression" }]
  },
  {
    code:
      "{{SUITESKIP}}('4321', {{ES}}" +
        "{{TEST}}('1234', {{ES}} " +
          "expect(func()).to.be.been.is.that.which.and.has.have.with.at.of.same.equal(1);" +
        "});" +
      "});",
    options: [{ maxAllowedComplexity: 0 }],
    errors: [{ message: "`{{TEST}}` has a complexity of 4. Maximum allowed is 0.", type: "CallExpression" }]
  }
]
const validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], assertions)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .uniqueCombos()
  .getCombos()

j.clearTemplates().clearCombos()
const invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code", "errors.@each.message"], assertions)
  .useCombosAsTemplates()
  .createCombos(["code", "errors.@each.message"], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .uniqueCombos()
  .getCombos()

ruleTester.run("complexity-it", rule, {
  valid: validTests,
  invalid: invalidTests
})
