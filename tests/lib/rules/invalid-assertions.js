"use strict"

const rule = require("../../../lib/rules/invalid-assertions")
const RuleTester = require("eslint").RuleTester
const testHelpers = require("../../../lib/utils/tests.js")
const n = require("../../../lib/utils/node.js")
const m = "Invalid assertion usage."
const ruleTester = new RuleTester({ env: { es6: true } })

const Jsonium = require("jsonium")
const j = new Jsonium()

const chains = n.chaiChainable.map(function (c) {
  return { CHAIN: "." + c }
})

chains.push({ CHAIN: "" })

let assertions = [
  { ASSERTION: "expect(1){{CHAIN}};", TYPE: "CallExpression" },
  { ASSERTION: "chai.expect(1){{CHAIN}};", TYPE: "CallExpression" },
  { ASSERTION: "chai['expect'](1){{CHAIN}};", TYPE: "CallExpression" },
  { ASSERTION: "'1'.should{{CHAIN}};", TYPE: "MemberExpression" },
  { ASSERTION: "'1'['should']{{CHAIN}};", TYPE: "MemberExpression" }
]

assertions = j
  .setTemplates(assertions)
  .createCombos("ASSERTION", chains)
  .uniqueCombos()
  .getCombos()

const validTestTemplates = [
  {
    code:
      "{{ASSERTION}}"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "{{ASSERTION}}" +
          "{{TEST}}('4321', {{ES}}" +
        "})" +
      "})"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "{{TESTSKIP}}('4321', {{ES}}" +
          "{{ASSERTION}}" +
        "})" +
      "})",
    options: [
      { skipSkipped: true }
    ]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{TEST}}('4321', {{ES}}" +
          "{{ASSERTION}}" +
        "})" +
      "})",
    options: [
      { skipSkipped: true }
    ]
  }
]

const invalidTestTemplates = [
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "{{TEST}}('4321', {{ES}}" +
          "{{ASSERTION}}" +
        "})" +
      "})",
    errors: [
      { message: m, type: "{{TYPE}}" }
    ]
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

const invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code", "errors.@each.type"], assertions)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .uniqueCombos()
  .getCombos()

ruleTester.run("invalid-assertions", rule, {
  valid: [
    "describe('1234', function () {" +
      "it('4321', function () {" +
        "return expect(1)" +
      "})" +
    "})"
  ].concat(validTests),
  invalid: invalidTests
})
