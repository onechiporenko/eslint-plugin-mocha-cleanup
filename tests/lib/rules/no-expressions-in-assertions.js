'use strict';

const rule = require('../../../lib/rules/no-expressions-in-assertions');
const { RuleTester } = require('eslint');
const testHelpers = require('../../../lib/utils/tests.js');
const ruleTester = new RuleTester({ env: { es6: true } });

const Jsonium = require('jsonium');
const j = new Jsonium();

const defaultMessage = 'Expression should not be used here.';
const detailedMessage = '`{{USE}}` should be used.';
const emptyArgMessage = 'Empty assertion is not allowed.';

const binariesForExpect = [
  { BINARY: '>', USE: '.to.be.above' },
  { BINARY: '<', USE: '.to.be.below' },
  { BINARY: '>=', USE: '.to.be.at.least' },
  { BINARY: '<=', USE: '.to.be.most' },
  { BINARY: '==', USE: '.to.be.equal' },
  { BINARY: '===', USE: '.to.be.equal' },
  { BINARY: '!=', USE: '.to.be.not.equal' },
  { BINARY: '!==', USE: '.to.be.not.equal' },
  { BINARY: 'instanceof', USE: '.to.be.instanceof' },
];

const binariesForAssert = [
  { BINARY: '>', USE: '.isAbove' },
  { BINARY: '<', USE: '.isBelow' },
  { BINARY: '>=', USE: '.isAtLeast' },
  { BINARY: '<=', USE: '.isAtMost' },
  { BINARY: '==', USE: '.equal' },
  { BINARY: '===', USE: '.strictEqual' },
  { BINARY: '!=', USE: '.notEqual' },
  { BINARY: '!==', USE: '.notStrictEqual' },
];

const logical = [
  { LOGICAL: '+' },
  { LOGICAL: '-' },
  { LOGICAL: '/' },
  { LOGICAL: '*' },
  { LOGICAL: '%' },
  { LOGICAL: '^' },
  { LOGICAL: '&&' },
  { LOGICAL: '||' },
];

const updates = [{ UPDATE: '++' }, { UPDATE: '--' }];

const unaries = [
  { UNARY: '!' },
  { UNARY: '~' },
  { UNARY: '+' },
  { UNARY: '-' },
];

const primitiveEqualitiesForExpect = [
  { EQL_BINARY: '==', NOT: '' },
  { EQL_BINARY: '===', NOT: '' },
  { EQL_BINARY: '!=', NOT: 'not.' },
  { EQL_BINARY: '!==', NOT: 'not.' },
];

const primitiveEqualitiesForAssert = [
  { EQL_BINARY: '==', NOT: '' },
  { EQL_BINARY: '===', NOT: '' },
  { EQL_BINARY: '!=', NOT: 'Not' },
  { EQL_BINARY: '!==', NOT: 'Not' },
];

const primitiveValuesForExpect = [
  { VAL: 'null', EQL_BINARY: '{{EQL_BINARY}}', USE: '.to.{{NOT}}be.null' },
  { VAL: 'true', EQL_BINARY: '{{EQL_BINARY}}', USE: '.to.{{NOT}}be.true' },
  { VAL: 'false', EQL_BINARY: '{{EQL_BINARY}}', USE: '.to.{{NOT}}be.false' },
  {
    VAL: 'undefined',
    EQL_BINARY: '{{EQL_BINARY}}',
    USE: '.to.{{NOT}}be.undefined',
  },
];

const primitiveValuesForAssert = [
  { VAL: 'null', EQL_BINARY: '{{EQL_BINARY}}', USE: '.is{{NOT}}Null' },
  { VAL: 'true', EQL_BINARY: '{{EQL_BINARY}}', USE: '.is{{NOT}}True' },
  { VAL: 'false', EQL_BINARY: '{{EQL_BINARY}}', USE: '.is{{NOT}}False' },
];

const primitiveAssertions = [
  { ASSERTION: 'a {{EQL_BINARY}} {{VAL}}', MESSAGE: detailedMessage },
  { ASSERTION: 'a {{EQL_BINARY}} {{VAL}}', MESSAGE: detailedMessage },
  { ASSERTION: '{{VAL}} {{EQL_BINARY}} b', MESSAGE: detailedMessage },
  { ASSERTION: '{{VAL}} {{EQL_BINARY}} b', MESSAGE: detailedMessage },
];

const primitiveAssertionsForExpect = j
  .setTemplates(primitiveAssertions)
  .createCombos(['ASSERTION', 'MESSAGE'], primitiveValuesForExpect)
  .useCombosAsTemplates()
  .createCombos(['ASSERTION', 'MESSAGE'], primitiveEqualitiesForExpect)
  .uniqueCombos()
  .getCombos();

const primitiveAssertionsForAssert = j
  .setTemplates(primitiveAssertions)
  .createCombos(['ASSERTION', 'MESSAGE'], primitiveValuesForAssert)
  .useCombosAsTemplates()
  .createCombos(['ASSERTION', 'MESSAGE'], primitiveEqualitiesForAssert)
  .uniqueCombos()
  .getCombos();

const assertions = [
  { ASSERTION: 'a {{BINARY}} b', MESSAGE: detailedMessage },
  { ASSERTION: 'a {{LOGICAL}} b', MESSAGE: defaultMessage },
  { ASSERTION: '{{UPDATE}} b', MESSAGE: defaultMessage },
  { ASSERTION: 'b{{UPDATE}}', MESSAGE: defaultMessage },
  { ASSERTION: '{{UNARY}} a', MESSAGE: defaultMessage },
  { ASSERTION: '', MESSAGE: emptyArgMessage },
];

const assertionsForExpect = j
  .setTemplates(assertions)
  .createCombos(['ASSERTION', 'MESSAGE'], binariesForExpect)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(['ASSERTION'], logical)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(['ASSERTION'], updates)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(['ASSERTION'], unaries)
  .uniqueCombos()
  .concatCombos(primitiveAssertionsForExpect)
  .getCombos();

const assertionsForAssert = j
  .setTemplates(assertions)
  .createCombos(['ASSERTION', 'MESSAGE'], binariesForAssert)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(['ASSERTION'], logical)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(['ASSERTION'], updates)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(['ASSERTION'], unaries)
  .uniqueCombos()
  .concatCombos(primitiveAssertionsForAssert)
  .getCombos();

const validTestTemplatesForExpect = [
  {
    code: '{{EXPECT}}({{ASSERTION}}).to.be.true;',
  },
  {
    code: '{{EXPECT}}(typeof a).to.be.true;',
  },
  {
    code: `{{SUITE}}('123', {{ES}}
      {{TESTSKIP}}('123', {{ES}}
        {{EXPECT}}({{ASSERTION}}).to.be.true;
      });
    });`,
    options: [{ skipSkipped: true }],
  },
  {
    code: `{{SUITESKIP}}('123', {{ES}}
      {{TEST}}('123', {{ES}}
        {{EXPECT}}({{ASSERTION}}).to.be.true;
      });
    });`,
    options: [{ skipSkipped: true }],
  },
];

const validTestTemplatesForAssert = [
  {
    code: '{{ASSERT}}.equal({{ASSERTION}});',
  },
  {
    code: '{{ASSERT}}.equal(typeof a);',
  },
  {
    code: `{{SUITE}}('123', {{ES}}
      {{TESTSKIP}}('123', {{ES}}
        {{ASSERT}}.equal({{ASSERTION}});
      });
    });`,
    options: [{ skipSkipped: true }],
  },
  {
    code: `{{SUITESKIP}}('123', {{ES}}
      {{TEST}}('123', {{ES}}
        {{ASSERT}}.equal({{ASSERTION}});
      });
    });`,
    options: [{ skipSkipped: true }],
  },
  {
    code: `{{SUITE}}('123', {{ES}}
      {{TESTSKIP}}('123', {{ES}}
        {{ASSERT}}({{ASSERTION}});
      });
    });`,
    options: [{ skipSkipped: true }],
  },
  {
    code: `{{SUITESKIP}}('123', {{ES}}
      {{TEST}}('123', {{ES}}
        {{ASSERT}}({{ASSERTION}});
      });
    });`,
    options: [{ skipSkipped: true }],
  },
];

const invalidTestTemplatesForExpect = [
  {
    code: `{{SUITE}}('123', {{ES}}
      {{TEST}}('123', {{ES}}
        {{EXPECT}}({{ASSERTION}}).to.be.true;
      });
    });`,
    errors: [{ message: '{{MESSAGE}}', type: 'CallExpression' }],
  },
];

const invalidTestTemplatesForAssert = [
  {
    code: `{{SUITE}}('123', {{ES}}
      {{TEST}}('123', {{ES}}
        {{ASSERT}}.equal({{ASSERTION}});
      });
    });`,
    errors: [{ message: '{{MESSAGE}}', type: 'MemberExpression' }],
  },
  {
    code: `{{SUITE}}('123', {{ES}}
      {{TEST}}('123', {{ES}}
        {{ASSERT}}({{ASSERTION}});
      });
    });`,
    errors: [{ message: '{{MESSAGE}}', type: '{{TYPE}}' }],
  },
];

let validTests = j
  .setTemplates(validTestTemplatesForExpect)
  .createCombos(['code'], assertionsForExpect)
  .useCombosAsTemplates()
  .createCombos(
    ['code'],
    [
      { EXPECT: 'expect' },
      { EXPECT: 'chai.expect' },
      { EXPECT: "chai['expect']" },
    ]
  )
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.es)
  .uniqueCombos()
  .getCombos();

validTests = j
  .setTemplates(validTestTemplatesForAssert)
  .createCombos(['code'], assertionsForAssert)
  .useCombosAsTemplates()
  .createCombos(
    ['code'],
    [
      { ASSERT: 'assert' },
      { ASSERT: 'chai.assert' },
      { ASSERT: "chai['assert']" },
    ]
  )
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.es)
  .uniqueCombos()
  .concatCombos(validTests)
  .getCombos();

let invalidTests = j
  .setTemplates(invalidTestTemplatesForExpect)
  .createCombos(['code', 'errors.@each.message'], assertionsForExpect)
  .useCombosAsTemplates()
  .createCombos(
    ['code'],
    [
      { EXPECT: 'expect' },
      { EXPECT: 'chai.expect' },
      { EXPECT: "chai['expect']" },
    ]
  )
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.es)
  .uniqueCombos()
  .getCombos();

invalidTests = j
  .setTemplates(invalidTestTemplatesForAssert)
  .createCombos(['code', 'errors.@each.message'], assertionsForAssert)
  .useCombosAsTemplates()
  .createCombos(
    ['code', 'errors.0.type'],
    [
      { ASSERT: 'assert', TYPE: 'CallExpression' },
      { ASSERT: 'chai.assert', TYPE: 'MemberExpression' },
      { ASSERT: "chai['assert']", TYPE: 'MemberExpression' },
    ]
  )
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.es)
  .uniqueCombos()
  .concatCombos(invalidTests)
  .getCombos();

ruleTester.run('no-expressions-in-assertions', rule, {
  valid: [
    `describe('123', function () {
      test('123', function () {
        assert('ok');
      });
    });`,
    `describe('123', function () {
      test('123', function () {
      expect('ok');
      });
    });`,
    `describe('123', function () {
      test('123', function () {
      assert.equal('ok');
      });
    });`,
    {
      code: `describe('123', function () {
        test('123', function () {
          assert.equal(a + b, 5);
        });
      });`,
      options: [{ replacementsOnly: true }],
    },
    {
      code: `describe('123', function () {
        test('123', function () {
          expect(a + b).to.equal(5);
        });
      });`,
      options: [{ replacementsOnly: true }],
    },
    {
      code: `describe('123', function () {
        test('123', function () {
          assert(+a);
        });
      });`,
      options: [{ replacementsOnly: true }],
    },
  ].concat(validTests),
  invalid: [
    {
      code: `describe('123', function () {
        test('123', function () {
          assert(a === undefined);
        });
      });`,
      errors: [
        { message: '`.isUndefined` should be used.', type: 'CallExpression' },
      ],
    },
    {
      code: `describe('123', function () {
        test('123', function () {
          assert(a !== undefined);
        });
      });`,
      errors: [
        { message: '`.isDefined` should be used.', type: 'CallExpression' },
      ],
    },
  ].concat(invalidTests),
});
