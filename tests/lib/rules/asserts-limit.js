"use strict"

var rule = require("../../../lib/rules/asserts-limit")
var RuleTester = require("eslint").RuleTester
var testHelpers = require("../../../lib/utils/tests.js")

var ruleTester = new RuleTester({ env: { es6: true } })

var Jsonium = require("jsonium")
var j = new Jsonium()

var assertions = [
  { ASSERTION: "chai.expect(1).to.be.equal(1);" },
  { ASSERTION: "chai['expect'](1).to.be.equal(1);" },
  { ASSERTION: "expect(1).to.be.equal(1);" },
  { ASSERTION: "'1'.should.equal('1');" },
  { ASSERTION: "'1'['should'].equal('1');" },
  { ASSERTION: "assert.equal(1, 1);" },
  { ASSERTION: "assert['equal'](1, 1);" },
  { ASSERTION: "chai.assert.equal(1, 1);" },
  { ASSERTION: "chai.assert['equal'](1, 1);" },
  { ASSERTION: "chai['assert']['equal'](1, 1);" },
  { ASSERTION: "chai['assert'].equal(1, 1);" },
  { ASSERTION: "assert(1, 1);" },
  { ASSERTION: "sinon.assert.calledOn(sp, {});" },
  { ASSERTION: "sinon['assert'].calledOn(sp, {});" }
]

var validTestTemplates = [
  {
    code:
        "{{TEST}}('1234', {{ES}}" +
          "{{ASSERTION}} {{ASSERTION}} {{ASSERTION}} {{ASSERTION}}" +
        "});",
    options: [{ assertsLimit: 4 }]
  },
  {
    code:
        "{{TEST}}('1234', {{ES}}" +
          "assert; {{ASSERTION}}" +
        "});"
  },
  {
    code:
        "{{TEST}}('1234', {{ES}}" +
          "should; {{ASSERTION}}" +
        "});"
  },
  {
    code:
        "{{TEST}}('1234', {{ES}}" +
          "notAssert['assert']; {{ASSERTION}}" +
        "});"
  },
  {
    code:
        "{{TEST}}('1234', {{ES}}" +
          "should(); {{ASSERTION}}" +
        "});"
  },
  {
    code:
        "{{TEST}}('1234', {{ES}}" +
          "expect; {{ASSERTION}}" +
        "});"
  },
  {
    code:
        "{{TEST}}('1234', {{ES}}" +
          "var expect = {};" + assertions[0] +
        "});"
  },
  {
    code:
        "{{TEST}}('1234', {{ES}}" +
          "var should = {}; {{ASSERTION}}" +
        "});"
  },
  {
    code:
        "{{TEST}}('1234', {{ES}}" +
          "var assert = {}; {{ASSERTION}}" +
        "});"
  },
  {
    code:
        "{{SUITESKIP}}('1234', {{ES}} " +
          "{{TEST}}('1234', {{ES}}" +
            "{{ASSERTION}} {{ASSERTION}} {{ASSERTION}}" +
          "});" +
         "});",
    options: [{ assertsLimit: 1, skipSkipped: true }],
    errors: [{ message: "Too many assertions (3). Maximum allowed is 2." }]
  },
  {
    code:
        "{{SUITESKIP}}('1234', {{ES}} " +
          "{{TEST}}('1234', {{ES}}" +
            "{{ASSERTION}} {{ASSERTION}} {{ASSERTION}}" +
          "});" +
         "});",
    settings: { "mocha-cleanup": { skipSkipped: true } },
    options: [{ assertsLimit: 1 }],
    errors: [{ message: "Too many assertions (3). Maximum allowed is 2." }]
  },
  {
    code:
        "{{SUITESKIP}}('1234', {{ES}} " +
          "{{SUITE}}('4321', {{ES}} " +
            "{{TEST}}('1234', {{ES}}" +
              "{{ASSERTION}} {{ASSERTION}} {{ASSERTION}}" +
            "});" +
          "});" +
        "});",
    options: [{ assertsLimit: 1, skipSkipped: true }]
  },
  {
    code:
        "{{TEST}}('1234', function (done) {" +
          "done();" +
        "});"
  },
  {
    code:
        "{{TEST}}('1234', function (done) {});"
  },
  {
    code:
        "{{TEST}}('1234', function (notDone) {" +
          "notDone();" +
        "});"
  },
  {
    code:
        "{{TEST}}('1234', function (notDone) {});"
  },
  {
    code:
       "{{TESTSKIP}}('1234', {{ES}}" +
          "{{ASSERTION}} {{ASSERTION}} {{ASSERTION}}" +
        "});",
    options: [{ assertsLimit: 1, skipSkipped: true }]
  },
  {
    code:
       "{{TESTSKIP}}('1234', {{ES}} });",
    options: [{ assertsLimit: 1, skipSkipped: true }]
  },
  {
    code:
        "{{SUITESKIP}}('1234', {{ES}} " +
          "{{TEST}}('1234', {{ES}} });" +
        "});",
    options: [{ assertsLimit: 1, skipSkipped: true }]
  },
  {
    code:
        "{{SUITESKIP}}('1234', {{ES}} " +
          "{{{{SUITE}}}}('4321', {{ES}} " +
            "{{TEST}}('1234', {{ES}} });" +
          "});" +
        "});",
    options: [{ assertsLimit: 1, skipSkipped: true }]
  }
]

var invalidTestTemplates = [
  {
    code:
        "{{TEST}}('1234', {{ES}}" +
          "{{ASSERTION}} {{ASSERTION}} {{ASSERTION}}" +
        "});",
    options: [{ assertsLimit: 2 }],
    errors: [{ message: "Too many assertions (3). Maximum allowed is 2.", type: "CallExpression" }]
  },
  {
    code:
        "{{SUITESKIP}}('1234', {{ES}} " +
          "{{SUITE}}('4321', {{ES}} " +
            "{{TEST}}('1234', {{ES}}" +
              "{{ASSERTION}} {{ASSERTION}} {{ASSERTION}}" +
            "});" +
          "});" +
        "});",
    options: [{ assertsLimit: 1 }],
    errors: [{ message: "Too many assertions (3). Maximum allowed is 1.", type: "CallExpression" }]
  },
  {
    code:
        "{{TESTSKIP}}('1234', {{ES}}" +
          "{{ASSERTION}} {{ASSERTION}} {{ASSERTION}}" +
        "});",
    options: [{ assertsLimit: 1 }],
    errors: [{ message: "Too many assertions (3). Maximum allowed is 1.", type: "CallExpression" }]
  }
]
var invalidTestTemplatesWithoutAssertions = [
  {
    code:
        "{{TEST}}('1234', {{ES}} });",
    errors: [{ message: "Test without assertions is not allowed.", type: "CallExpression" }]
  },
  {
    code:
        "{{TESTSKIP}}('1234', {{ES}} });",
    errors: [{ message: "Test without assertions is not allowed.", type: "CallExpression" }]
  },
  {
    code:
        "{{SUITESKIP}}('1234',{{ES}} " +
          "{{TEST}}('1234', {{ES}} });" +
        "});",
    errors: [{ message: "Test without assertions is not allowed.", type: "CallExpression" }]
  },
  {
    code:
        "{{SUITE}}('1234', {{ES}} " +
          "{{TEST}}('1234', {{ES}} });" +
        "});",
    errors: [{ message: "Test without assertions is not allowed.", type: "CallExpression" }]
  },
  {
    code:
        "{{SUITESKIP}}('1234', {{ES}} " +
          "{{SUITE}}('4321', {{ES}} " +
            "{{TEST}}('1234', {{ES}} });" +
          "});" +
        "});",
    errors: [{ message: "Test without assertions is not allowed.", type: "CallExpression" }]
  },
  {
    code:
        "{{TEST}}('1234', function (done) {" +
          "done();" +
        "});",
    options: [{ assertsLimit: 1, skipSkipped: true, ignoreZeroAssertionsIfDoneExists: false }],
    errors: [{ message: "Test without assertions is not allowed.", type: "CallExpression" }]
  },
  {
    code:
        "{{TEST}}('1234', function (done) {});",
    options: [{ assertsLimit: 1, skipSkipped: true, ignoreZeroAssertionsIfDoneExists: false }],
    errors: [{ message: "Test without assertions is not allowed.", type: "CallExpression" }]
  },
  {
    code:
        "{{TEST}}('1234', function (notDone) {" +
          "notDone();" +
        "});",
    options: [{ assertsLimit: 1, skipSkipped: true, ignoreZeroAssertionsIfDoneExists: false }],
    errors: [{ message: "Test without assertions is not allowed.", type: "CallExpression" }]
  },
  {
    code:
        "{{TEST}}('1234', function (notDone) {});",
    options: [{ assertsLimit: 1, skipSkipped: true, ignoreZeroAssertionsIfDoneExists: false }],
    errors: [{ message: "Test without assertions is not allowed.", type: "CallExpression" }]
  }
]

function filter (combo) {
  return !combo.code.match(/\{\s*\}/)
}

var validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], assertions)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.mochaDatasets)
  .uniqueCombos()
  .getCombos()
  .filter(filter)

j.clearTemplates().clearCombos()

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], assertions)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.mochaDatasets)
  .uniqueCombos()
  .getCombos()
  .filter(filter)

j.clearTemplates().clearCombos()

invalidTests = j
  .setTemplates(invalidTestTemplatesWithoutAssertions)
  .createCombos(["code"], assertions)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.mochaDatasets)
  .concatCombos(invalidTests)
  .uniqueCombos()
  .getCombos()

ruleTester.run("asserts-limit", rule, {
  valid: validTests,
  invalid: invalidTests
})
