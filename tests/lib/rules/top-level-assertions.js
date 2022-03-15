"use strict"

const rule = require("../../../lib/rules/top-level-assertions")
const { RuleTester } = require("eslint")

const ruleTester = new RuleTester({ env: { es6: true } })

const testHelpers = require("../../../lib/utils/tests.js")

const message = "This assertion is deeply nested. Are you sure it's called?"

const Jsonium = require("jsonium")
const j = new Jsonium()

const asserts = [
  { ASSERT: "expect(1).to.be.equal(1);", TYPE: "CallExpression" },
  { ASSERT: "'1'.should.equal('1');", TYPE: "MemberExpression" },
  { ASSERT: "'1'['should'].equal('1');", TYPE: "MemberExpression" },
  { ASSERT: "assert.equal(1, 1);", TYPE: "MemberExpression" },
  { ASSERT: "assert(1, 1);", TYPE: "CallExpression" },
  { ASSERT: "sinon.assert.calledOn(sp, {});", TYPE: "MemberExpression" },
  { ASSERT: "sinon['assert'].calledOn(sp, {});", TYPE: "MemberExpression" }
]

const validTestTemplates = [
  {
    code:
      `{{TEST}}('1234', {{ES}}
        {{ASSERT}}
      });`
  },
  {
    code:
      `{{TESTSKIP}}('1234', {{ES}}
        [].forEach({{ES}}
          {{ASSERT}}
        });
      });`,
    options: [{ skipSkipped: true }]
  },
  {
    code:
      `{{TEST}}('1234', {{ES}}
        Assertion.expectAssertions(1);
        [].forEach({{ES}}
          {{ASSERT}}
        });
      });`,
    options: [{ assertionsCheckExpression: /Assertion\.expectAssertions\(\d+\)/.source }]
  },
  {
    code:
      `{{SUITESKIP}}('1234', {{ES}}
        {{TEST}}('1234', {{ES}}
          [].forEach({{ES}}
            {{ASSERT}}
          });
        });
      });`,
    options: [{ skipSkipped: true }]
  },
  {
    code:
      `{{SUITESKIP}}('1234', {{ES}}
        {{TEST}}('1234', {{ES}}
          [].forEach({{ES}}
            {{ASSERT}}
          });
        });
      });`,
    options: [{ skipSkipped: true }]
  }
]

const invalidTestTemplates = [
  {
    code:
      `{{TEST}}('1234', {{ES}}
        function a () {
          [].forEach({{ES}}
            {{ASSERT}}
          });
        }
      });`,
    errors: [
      { message, type: "{{TYPE}}" }
    ]
  },
  {
    code:
      `{{TEST}}('1234', {{ES}}
        var a = {{ES}}
          [].forEach({{ES}}
            [].forEach({{ES}}
              {{ASSERT}}
            });
          });
        }
      });`,
    errors: [
      { message, type: "{{TYPE}}" }
    ]
  },
  {
    code:
      `{{TEST}}('1234', {{ES}}
        function a () {
          [].forEach({{ES}}
            [].forEach({{ES}}
              {{ASSERT}}
            });
          });
        }
      });`,
    errors: [
      { message, type: "{{TYPE}}" }
    ]
  },
  {
    code:
      `{{TEST}}('1234', {{ES}}
        function a () {
          {{ASSERT}}
        }
      });`,
    errors: [
      { message, type: "{{TYPE}}" }
    ]
  },
  {
    code:
      `{{TEST}}('1234', {{ES}}
        [].forEach({{ES}}
          {{ASSERT}}
        });
      });`,
    errors: [
      { message, type: "{{TYPE}}" }
    ]
  },
  {
    code:
      `{{TESTSKIP}}('1234', {{ES}}
        [].forEach({{ES}}
          [].forEach({{ES}}
            {{ASSERT}}
          });
        });
      });`,
    errors: [
      { message, type: "{{TYPE}}" }
    ]
  },
  {
    code:
      `{{TEST}}('1234', {{ES}}
        class A {
          mthd() { {{ASSERT}} {{ASSERT}} }
        }
      });`,
    errors: [
      { message, type: "{{TYPE}}" },
      { message, type: "{{TYPE}}" }
    ]
  },
  {
    code:
      `{{TEST}}('1234', () =>
        [].forEach({{ES}}
          {{ASSERT}}
        })
      );`,
    errors: [
      { message }
    ]
  },
  {
    code:
      `{{TEST}}('1234', {{ES}}
        Assertion.expectAssertions(1);
        ['a'].forEach({{ES}}
          {{ASSERT}}
        })
      });
      {{TEST}}('1234', {{ES}}
        [].forEach({{ES}}
          {{ASSERT}}
        })
      });`,
    errors: [
      { message }
    ],
    options: [
      {
        assertionsCheckExpression: /Assertion\.expectAssertions\(\d+\)/gm.source
      }
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

ruleTester.run("top-level-assertions", rule, {
  valid: validTests,
  invalid: invalidTests
})
