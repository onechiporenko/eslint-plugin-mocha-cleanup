"use strict"

const rule = require("../../../lib/rules/disallow-stub-spy-restore-in-it")
const RuleTester = require("eslint").RuleTester
const testHelpers = require("../../../lib/utils/tests.js")
const ruleTester = new RuleTester({ env: { es6: true } })
const Jsonium = require("jsonium")
const j = new Jsonium()

const validTestTemplates = [
  {
    code: "sinon.restore();"
  },
  {
    code: "sinon['restore']();"
  },
  {
    code:
      "{{TEST}}('1234', {{ES}}" +
        "var stub = '12345';" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', {{ES}}" +
        "var spy = '12345';" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', {{ES}}" +
        "var restore = '12345';" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', {{ES}}" +
        "var a = restore.a;" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', {{ES}}" +
        "var a = stub.a;" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', {{ES}}" +
        "var a = spy.a;" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', {{ES}}" +
        "this.stub = '1234';" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', {{ES}}" +
        "this['stub'] = '1234';" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', {{ES}}" +
        "this.stub.returns(1234);" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', {{ES}}" +
        "this['stub'].returns(1234);" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', {{ES}}" +
        "this.stub.withArgs(1234).returns(4321);" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', {{ES}}" +
        "this['stub'].withArgs(1234).returns(4321);" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "before({{ES}}" +
          "sinon.stub{{MOD}}(); " +
          "sinon.spy{{MOD}}(); " +
          "sinon.restore{{MOD}}();" +
        "}); " +
        "{{TEST}}('4321', {{ES}}});" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "before({{ES}}" +
          "sinon['stub']{{MOD}}(); " +
          "sinon['spy']{{MOD}}(); " +
          "sinon['restore']{{MOD}}();" +
        "}); " +
        "{{TEST}}('4321', {{ES}}});" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "beforeEach({{ES}}" +
          "sinon.stub{{MOD}}(); " +
          "sinon.spy{{MOD}}(); " +
          "sinon.restore{{MOD}}();" +
        "}); " +
        "{{TEST}}('4321', {{ES}}});" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "beforeEach({{ES}}" +
          "sinon['stub']{{MOD}}(); " +
          "sinon['spy']{{MOD}}(); " +
          "sinon['restore']{{MOD}}();" +
        "}); " +
        "{{TEST}}('4321', {{ES}}});" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "after({{ES}}" +
          "sinon.stub{{MOD}}(); " +
          "sinon.spy{{MOD}}(); " +
          "sinon.restore{{MOD}}();" +
        "}); " +
        "{{TEST}}('4321', {{ES}}});" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "after({{ES}}" +
          "sinon['stub']{{MOD}}(); " +
          "sinon['spy']{{MOD}}(); " +
          "sinon['restore']{{MOD}}();" +
        "}); " +
        "{{TEST}}('4321', {{ES}}});" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "afterEach({{ES}}" +
          "sinon.stub{{MOD}}(); " +
          "sinon.spy{{MOD}}(); " +
          "sinon.restore{{MOD}}();" +
        "}); " +
        "{{TEST}}('4321', {{ES}}});" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "afterEach({{ES}}" +
          "sinon['stub']{{MOD}}(); " +
          "sinon['spy']{{MOD}}(); " +
          "sinon['restore']{{MOD}}();" +
        "}); " +
        "{{TEST}}('4321', {{ES}}});" +
      "});"
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{TEST}}('12345', {{ES}}" +
          "sinon.restore{{MOD}}();" +
        "});" +
      "});",
    options: [{ skipSkipped: true }]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{TEST}}('12345', {{ES}}" +
          "sinon['restore']{{MOD}}();" +
        "});" +
      "});",
    options: [{ skipSkipped: true }]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{TEST}}('12345', {{ES}}" +
          "sinon.stub{{MOD}}();" +
        "});" +
     "});",
    options: [{ skipSkipped: true }]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{TEST}}('12345', {{ES}}" +
          "sinon['stub']{{MOD}}();" +
        "});" +
     "});",
    options: [{ skipSkipped: true }]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{TEST}}('12345', {{ES}}" +
          "sinon.spy{{MOD}}();" +
        "});" +
      "});",
    options: [{ skipSkipped: true }]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{TEST}}('12345', {{ES}}" +
          "sinon['spy']{{MOD}}();" +
        "});" +
      "});",
    options: [{ skipSkipped: true }]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}} " +
        "[].forEach({{ES}}" +
          "{{TEST}}('12345', {{ES}}" +
            "sinon.spy{{MOD}}();" +
          "});" +
        "});" +
      "});",
    options: [{ skipSkipped: true }]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}} " +
        "[].forEach({{ES}}" +
          "{{TEST}}('12345', {{ES}}" +
            "sinon['spy']{{MOD}}();" +
          "});" +
        "});" +
      "});",
    options: [{ skipSkipped: true }]
  },
  {
    code:
      "{{TESTSKIP}}('12345', {{ES}}" +
        "sinon.stub{{MOD}}().withArgs().returns();" +
      "});",
    options: [{ skipSkipped: true }]
  },
  {
    code:
      "{{TESTSKIP}}('12345', {{ES}}" +
        "sinon['stub']{{MOD}}().withArgs().returns();" +
      "});",
    options: [{ skipSkipped: true }]
  }
]

const invalidTestTemplates = [
  {
    code:
      "{{TEST}}('12345', {{ES}}" +
        "sinon.restore{{MOD}}();" +
      "});",
    errors: [{ message: "`restore` is not allowed to use inside `{{TEST}}`.", type: "CallExpression" }]
  },
  {
    code:
      "{{TEST}}('12345', {{ES}}" +
        "sinon['restore']{{MOD}}();" +
      "});",
    errors: [{ message: "`restore` is not allowed to use inside `{{TEST}}`.", type: "CallExpression" }]
  },
  {
    code:
      "{{TEST}}('12345', {{ES}}" +
        "sinon.stub{{MOD}}();" +
      "});",
    errors: [{ message: "`stub` is not allowed to use inside `{{TEST}}`.", type: "CallExpression" }]
  },
  {
    code:
      "{{TEST}}('12345', {{ES}}" +
        "sinon['stub']{{MOD}}();" +
      "});",
    errors: [{ message: "`stub` is not allowed to use inside `{{TEST}}`.", type: "CallExpression" }]
  },
  {
    code:
      "{{TEST}}('12345', {{ES}}" +
        "sinon.spy{{MOD}}();" +
      "});",
    errors: [{ message: "`spy` is not allowed to use inside `{{TEST}}`.", type: "CallExpression" }]
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}} " +
        "[].forEach({{ES}}" +
          "{{TEST}}('12345', {{ES}}" +
            "sinon.spy{{MOD}}();" +
          "});" +
        "});" +
      "});",
    errors: [{ message: "`spy` is not allowed to use inside `{{TEST}}`.", type: "CallExpression" }]
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}} " +
        "[].forEach({{ES}}" +
          "{{TEST}}('12345', {{ES}}" +
            "sinon['spy']{{MOD}}();" +
          "});" +
        "});" +
      "});",
    errors: [{ message: "`spy` is not allowed to use inside `{{TEST}}`.", type: "CallExpression" }]
  },
  {
    code:
      "{{TEST}}('12345', {{ES}}" +
        "sinon.stub{{MOD}}().withArgs().returns();" +
      "});",
    errors: [{ message: "`stub` is not allowed to use inside `{{TEST}}`.", type: "CallExpression" }]
  },
  {
    code:
      "{{TEST}}('12345', {{ES}}" +
        "sinon['stub']{{MOD}}().withArgs().returns();" +
      "});",
    errors: [{ message: "`stub` is not allowed to use inside `{{TEST}}`.", type: "CallExpression" }]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{TEST}}('12345', {{ES}}" +
          "sinon.restore{{MOD}}();" +
        "});" +
      "});",
    errors: [{ message: "`restore` is not allowed to use inside `{{TEST}}`.", type: "CallExpression" }]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{TEST}}('12345', {{ES}}" +
          "sinon['restore']{{MOD}}();" +
        "});" +
      "});",
    errors: [{ message: "`restore` is not allowed to use inside `{{TEST}}`.", type: "CallExpression" }]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{TEST}}('12345', {{ES}}" +
          "sinon.stub{{MOD}}();" +
        "});" +
      "});",
    errors: [{ message: "`stub` is not allowed to use inside `{{TEST}}`.", type: "CallExpression" }]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{TEST}}('12345', {{ES}}" +
          "sinon['stub']{{MOD}}();" +
        "});" +
      "});",
    errors: [{ message: "`stub` is not allowed to use inside `{{TEST}}`.", type: "CallExpression" }]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{TEST}}('12345', {{ES}}" +
          "sinon.spy{{MOD}}();" +
        "});" +
      "});",
    errors: [{ message: "`spy` is not allowed to use inside `{{TEST}}`.", type: "CallExpression" }]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{TEST}}('12345', {{ES}}" +
          "sinon['spy']{{MOD}}();" +
        "});" +
      "});",
    errors: [{ message: "`spy` is not allowed to use inside `{{TEST}}`.", type: "CallExpression" }]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}} " +
        "[].forEach({{ES}}" +
          "{{TEST}}('12345', {{ES}}" +
            "sinon.spy{{MOD}}();" +
          "});" +
        "});" +
      "});",
    errors: [{ message: "`spy` is not allowed to use inside `{{TEST}}`.", type: "CallExpression" }]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}} " +
        "[].forEach({{ES}}" +
          "{{TEST}}('12345', {{ES}}" +
            "sinon['spy']{{MOD}}();" +
          "});" +
        "});" +
      "});",
    errors: [{ message: "`spy` is not allowed to use inside `{{TEST}}`.", type: "CallExpression" }]
  },
  {
    code:
      "{{TESTSKIP}}('12345', {{ES}}" +
        "sinon.stub{{MOD}}().withArgs().returns();" +
      "});",
    errors: [{ message: "`stub` is not allowed to use inside `{{TESTSKIP}}`.", type: "CallExpression" }]
  },
  {
    code:
      "{{TESTSKIP}}('12345', {{ES}}" +
        "sinon['stub']{{MOD}}().withArgs().returns();" +
      "});",
    errors: [{ message: "`stub` is not allowed to use inside `{{TESTSKIP}}`.", type: "CallExpression" }]
  }
]

const validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], [{ MOD: ".apply" }, { MOD: ".call" }, { MOD: "" }])
  .uniqueCombos()
  .getCombos()

j.clearTemplates().clearCombos()
const invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code", "errors.@each.message"], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["code"], [{ MOD: ".apply" }, { MOD: ".call" }, { MOD: "" }])
  .uniqueCombos()
  .getCombos()

ruleTester.run("disallow-stub-spy-restore-in-it", rule, {
  valid: validTests,
  invalid: invalidTests
})
