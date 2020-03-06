"use strict"

const rule = require("../../../lib/rules/no-assertions-in-loop")
const { RuleTester } = require("eslint")
const testHelpers = require("../../../lib/utils/tests.js")
const ruleTester = new RuleTester({ env: { es6: true } })

const Jsonium = require("jsonium")
const j = new Jsonium()

const loops = [
  { code: "for(var i = 0; i < 5; i++) {{{ASSERTION}}}" },
  { code: "for(var i in obj) {{{ASSERTION}}}" },
  { code: "while(i < 5) {{{ASSERTION}}}" },
  { code: "do {{{ASSERTION}}} while (i < 5)" }
]

const pLoops = [
  {
    LO: "for(var i = 0; i < 5; i++) {",
    OP: "}"
  },
  {
    LO: "for(var i in obj) {",
    OP: "}"
  },
  {
    LO: "while(i < 5) {",
    OP: "}"
  },
  {
    LO: "do {",
    OP: "} while (i < 5)"
  }
]

const assertions = [
  { ASSERTION: "assert.equal(1, 1);" },
  { ASSERTION: "assert(1, 1);" },
  { ASSERTION: "assert['equal'](1, 1);" },
  { ASSERTION: "expect(1).to.be.equal(1);" },
  { ASSERTION: "'1'.should.be.equal('1');" },
  { ASSERTION: "'1'['should'].be.equal('1');" },
  { ASSERTION: "sinon.assert.called(a, 1);" },
  { ASSERTION: "sinon['assert'].called(a, 1);" }
]

const validTestTemplates = [
  {
    code:
      "{{LO}}" +
        "{{SUITE}}('1234', {{ES}}" +
          "{{TEST}}('4321', {{ES}}" +
            "{{ASSERTION}}" +
          "});" +
        "});" +
      "{{OP}}"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "{{TEST}}('4321', {{ES}}" +
          "{{ASSERTION}}" +
        "});" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "{{TESTSKIP}}('4321', {{ES}}" +
          "{{LOOP}}" +
        "});" +
      "});",
    options: [{ skipSkipped: true }]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{TEST}}('4321', {{ES}}" +
          "{{LOOP}}" +
        "});" +
      "});",
    options: [{ skipSkipped: true }]
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "{{TESTSKIP}}('4321', {{ES}}" +
          "obj.forEach({{ES}}" +
            "{{ASSERTION}}" +
          "});" +
        "});" +
      "});",
    options: [{ skipSkipped: true, extraMemberExpression: ["forEach"] }]
  }
]

const invalidTestTemplates = [
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "{{TEST}}('4321', {{ES}}" +
          "{{LOOP}}" +
        "});" +
      "});",
    errors: [
      { message: "Assertions should not be used in loops." }
    ]
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "{{TESTSKIP}}('4321', {{ES}}" +
          "{{LOOP}}" +
        "});" +
      "});",
    errors: [
      { message: "Assertions should not be used in loops." }
    ]
  },
  {
    code:
      "{{SUITESKIP}}('1234', {{ES}}" +
        "{{TEST}}('4321', {{ES}}" +
          "{{LOOP}}" +
        "});" +
      "});",
    errors: [
      { message: "Assertions should not be used in loops." }
    ]
  },
  {
    code:
      "{{SUITE}}('1234', {{ES}}" +
        "{{TESTSKIP}}('4321', {{ES}}" +
          "obj.forEach({{ES}}" +
            "{{ASSERTION}}" +
          "});" +
        "});" +
      "});",
    options: [{ extraMemberExpression: ["forEach"] }],
    errors: [
      { message: "Assertions should not be used in loops." }
    ]
  }
]

const loopsWithAssertions = j
  .setTemplates(loops)
  .createCombos("code", assertions)
  .uniqueCombos()
  .switchKeys("code", "LOOP")
  .getCombos()

const validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], pLoops)
  .useCombosAsTemplates()
  .createCombos(["code"], loopsWithAssertions)
  .useCombosAsTemplates()
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
  .createCombos(["code"], loopsWithAssertions)
  .useCombosAsTemplates()
  .createCombos(["code", "errors.@each.message"], assertions)
  .useCombosAsTemplates()
  .createCombos(["code", "errors.@each.message"], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .uniqueCombos()
  .getCombos()

ruleTester.run("no-assertions-in-loop", rule, {
  valid: validTests,
  invalid: invalidTests
})
