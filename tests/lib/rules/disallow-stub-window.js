"use strict"

var rule = require("../../../lib/rules/disallow-stub-window")
var RuleTester = require("eslint").RuleTester
var testHelpers = require("../../../lib/utils/tests.js")
var Jsonium = require("jsonium")
var j = new Jsonium()

var ruleTester = new RuleTester({ env: { es6: true } })

var m1 = "`sinon.stub` should not be used for `window.{{METHOD1}}`"
var m2 = "`sinon.stub` should not be used for `window.{{METHOD2}}`"

var templates = [
  {
    code:
      "{{CODE}}",
    options: [
      { methods: ["{{METHOD1}}", "{{METHOD2}}"] }
    ],
    errors: [
      { message: m1 },
      { message: m2 }
    ]
  },
  {
    code:
      "{{SUITE}} ('1234', {{ES}}" +
        "{{TEST}} ('4321', {{ES}}" +
          "{{CODE}}" +
        "});" +
      "});",
    options: [
      { methods: ["{{METHOD1}}", "{{METHOD2}}"] }
    ],
    errors: [
      { message: m1 },
      { message: m2 }
    ]
  },
  {
    code:
      "{{SUITESKIP}} ('1234', {{ES}}" +
        "{{TEST}} ('4321', {{ES}}" +
          "{{CODE}}" +
        "});" +
      "});",
    options: [
      { methods: ["{{METHOD1}}", "{{METHOD2}}"] }
    ],
    errors: [
      { message: m1 },
      { message: m2 }
    ]
  },
  {
    code:
      "{{SUITESKIP}} ('1234', {{ES}}" +
        "{{HOOK}} ('4321', {{ES}}" +
          "{{CODE}}" +
        "});" +
      "});",
    options: [
      { methods: ["{{METHOD1}}", "{{METHOD2}}"] }
    ],
    errors: [
      { message: m1 },
      { message: m2 }
    ]
  },
  {
    code:
      "{{SUITE}} ('1234', {{ES}}" +
        "{{TESTSKIP}} ('4321', {{ES}}" +
          "{{CODE}}" +
        "});" +
      "});",
    options: [
      { methods: ["{{METHOD1}}", "{{METHOD2}}"] }
    ],
    errors: [
      { message: m1 },
      { message: m2 }
    ]
  }
]

var stubs = [
  { STUB: "sinon.stub" },
  { STUB: "sinon['stub']" },
  { STUB: "stub" }
]

var codes = [
  { CODE: "{{STUB}}(window, '{{METHOD1}}'); {{STUB}}(window, '{{METHOD2}}');" },
  { CODE: "var stub = {{STUB}}(window, '{{METHOD1}}'); {{STUB}}(window, '{{METHOD2}}', function () {});" }
]

var methods = [
  { METHOD1: "setTimeout", METHOD2: "clearTimeout" },
  { METHOD1: "setInterval", METHOD2: "ClearInterval" }
]

var hooks = [
  { HOOK: "before" },
  { HOOK: "beforeEach" },
  { HOOK: "after" },
  { HOOK: "afterEach" }
]

var validTests = j
  .setTemplates(templates)
  .createCombos(["code"], hooks)
  .useCombosAsTemplates()
  .createCombos(["code"], codes)
  .useCombosAsTemplates()
  .createCombos(["code"], stubs)
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.methods.@each", "errors.@each.message"], methods)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .uniqueCombos()
  .getCombos()
  .map(function (c) {
    c.options[0].methods = ["someFakeMethod"]
    return c
  })

var invalidTests = j
  .setTemplates(templates)
  .createCombos(["code"], hooks)
  .useCombosAsTemplates()
  .createCombos(["code"], codes)
  .useCombosAsTemplates()
  .createCombos(["code"], stubs)
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.methods.@each", "errors.@each.message"], methods)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .uniqueCombos()
  .getCombos()

ruleTester.run("disallow-stub-window", rule, {
  valid: [
    "stub(notWindow, 'setTimeout');"
  ].concat(validTests),
  invalid: invalidTests
})
