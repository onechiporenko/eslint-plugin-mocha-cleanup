'use strict';

const rule = require('../../../lib/rules/no-eql-primitives');
const { RuleTester } = require('eslint');
const testHelpers = require('../../../lib/utils/tests.js');
const ruleTester = new RuleTester({ env: { es6: true } });

const Jsonium = require('jsonium');
const j = new Jsonium();

const invalidVals = [
  { VAL: '1' },
  { VAL: 'true' },
  { VAL: "''" },
  { VAL: 'null' },
];

const validVals = [{ VAL: '{}' }, { VAL: 'b' }];

let invalidAssertions = [
  {
    INVALID_ASSERTION: 'assert.deepEqual(a, {{VAL}});',
    IN_MESSAGE: 'assert.deepEqual',
  },
  {
    INVALID_ASSERTION: "assert['deepEqual'](a, {{VAL}});",
    IN_MESSAGE: 'assert.deepEqual',
  },
  {
    INVALID_ASSERTION: 'assert.notDeepEqual(a, {{VAL}});',
    IN_MESSAGE: 'assert.notDeepEqual',
  },
  {
    INVALID_ASSERTION: "assert['notDeepEqual'](a, {{VAL}});",
    IN_MESSAGE: 'assert.notDeepEqual',
  },
  { INVALID_ASSERTION: 'expect(a).to.be.eql({{VAL}});', IN_MESSAGE: '.eql' },
  {
    INVALID_ASSERTION: 'expect(a).to.be.deep.equal({{VAL}});',
    IN_MESSAGE: '.deep.equal',
  },
  { INVALID_ASSERTION: 'a.should.be.eql({{VAL}});', IN_MESSAGE: '.eql' },
  { INVALID_ASSERTION: "a['should'].be.eql({{VAL}});", IN_MESSAGE: '.eql' },
  {
    INVALID_ASSERTION: 'a.should.be.deep.equal({{VAL}});',
    IN_MESSAGE: '.deep.equal',
  },
  {
    INVALID_ASSERTION: "a['should'].be.deep.equal({{VAL}});",
    IN_MESSAGE: '.deep.equal',
  },
];
let validAssertions = [
  { ASSERTION: 'assert.deepEqual(a, {{VAL}});' },
  { ASSERTION: 'chai.assert.deepEqual(a, {{VAL}});' },
  { ASSERTION: "chai['assert'].deepEqual(a, {{VAL}});" },
  { ASSERTION: "assert['deepEqual'](a, {{VAL}});" },
  { ASSERTION: "chai.assert['deepEqual'](a, {{VAL}});" },
  { ASSERTION: 'assert.notDeepEqual(a, {{VAL}});' },
  { ASSERTION: 'chai.assert.notDeepEqual(a, {{VAL}});' },
  { ASSERTION: "chai['assert'].notDeepEqual(a, {{VAL}});" },
  { ASSERTION: "assert['notDeepEqual'](a, {{VAL}});" },
  { ASSERTION: 'expect(a).to.be.eql({{VAL}});' },
  { ASSERTION: 'chai.expect(a).to.be.eql({{VAL}});' },
  { ASSERTION: "chai['expect'](a).to.be.eql({{VAL}});" },
  { ASSERTION: 'a.should.be.eql({{VAL}});' },
  { ASSERTION: "a['should'].be.eql({{VAL}});" },
  { ASSERTION: 'a.should.be.deep.equal({{VAL}});' },
  { ASSERTION: "a['should'].be.deep.equal({{VAL}});" },
];

const validTestTemplates = [
  {
    code: `{{TEST}}('123', {{ES}}
      {{ASSERTION}}
    });`,
  },
  {
    code: `{{SUITESKIP}}('123', {{ES}}
      {{TEST}}('123', {{ES}}
        {{INVALID_ASSERTION}}
      });
    });`,
    options: [{ skipSkipped: true }],
  },
  {
    code: `{{SUITE}}('123', {{ES}}
      {{TESTSKIP}}('123', {{ES}}
        {{INVALID_ASSERTION}}
      });
    });`,
    options: [{ skipSkipped: true }],
  },
];

const invalidTestTemplates = [
  {
    code: `{{TEST}}('123', {{ES}}
      {{INVALID_ASSERTION}}
    });`,
    errors: [
      {
        message: '`{{IN_MESSAGE}}` should not be used with primitives.',
        type: 'MemberExpression',
      },
    ],
  },
  {
    code: `{{TESTSKIP}}('123', {{ES}}
      {{INVALID_ASSERTION}}
    });`,
    errors: [
      {
        message: '`{{IN_MESSAGE}}` should not be used with primitives.',
        type: 'MemberExpression',
      },
    ],
  },
  {
    code: `{{SUITESKIP}}('123', {{ES}}
      {{TEST}}('123', {{ES}}
        {{INVALID_ASSERTION}}
      });
    });`,
    errors: [
      {
        message: '`{{IN_MESSAGE}}` should not be used with primitives.',
        type: 'MemberExpression',
      },
    ],
  },
];

validAssertions = j
  .setTemplates(validAssertions)
  .createCombos(['ASSERTION'], validVals)
  .uniqueCombos()
  .getCombos();

j.clearTemplates().clearCombos();

invalidAssertions = j
  .setTemplates(invalidAssertions)
  .createCombos(['INVALID_ASSERTION'], invalidVals)
  .uniqueCombos()
  .getCombos();

j.clearTemplates().clearCombos();

const validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(['code'], validAssertions)
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.es)
  .uniqueCombos()
  .getCombos();

j.clearTemplates().clearCombos();

const invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(['code', 'errors.@each.message'], invalidAssertions)
  .useCombosAsTemplates()
  .createCombos(['code', 'errors.@each.message'], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.es)
  .uniqueCombos()
  .getCombos();

ruleTester.run('no-eql-primitives', rule, {
  valid: [
    {
      // This type doesn't seem to get through the `valid` examples
      //   above, though this is based on them
      code:
        "describe.skip('123', function () {" +
        "it('123', function () {" +
        'assert.deepEqual(a, 1)' +
        '});' +
        '});',
      options: [{ skipSkipped: true }],
    },
    "it('123', function () {" + "abc[''];" + '});',
    "it('123', function () {" + "abc.foo[''];" + '});',
    "it('123', function () {" + 'assert.deepEqual(a, /foo/);' + '});',
    "it('123', function () {" + 'expect(a).to.be.eql(/foo/);' + '});',
  ].concat(validTests),
  invalid: invalidTests,
});
