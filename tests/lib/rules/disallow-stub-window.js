'use strict';

const rule = require('../../../lib/rules/disallow-stub-window');
const { RuleTester } = require('eslint');
const testHelpers = require('../../../lib/utils/tests.js');
const Jsonium = require('jsonium');
const j = new Jsonium();

const ruleTester = new RuleTester({ env: { es6: true } });

const m1 = '`sinon.stub` should not be used for `window.{{METHOD1}}`';
const m2 = '`sinon.stub` should not be used for `window.{{METHOD2}}`';

const templates = [
  {
    code: '{{CODE}}',
    options: [{ methods: ['{{METHOD1}}', '{{METHOD2}}'] }],
    errors: [{ message: m1 }, { message: m2 }],
  },
  {
    code: `{{SUITE}} ('1234', {{ES}}
      {{TEST}} ('4321', {{ES}}
        {{CODE}}
      });
    });`,
    options: [{ methods: ['{{METHOD1}}', '{{METHOD2}}'] }],
    errors: [{ message: m1 }, { message: m2 }],
  },
  {
    code: `{{SUITESKIP}} ('1234', {{ES}}
      {{TEST}} ('4321', {{ES}}
        {{CODE}}
      });
    });`,
    options: [{ methods: ['{{METHOD1}}', '{{METHOD2}}'] }],
    errors: [{ message: m1 }, { message: m2 }],
  },
  {
    code: `{{SUITESKIP}} ('1234', {{ES}}
      {{HOOK}} ('4321', {{ES}}
        {{CODE}}
      });
    });`,
    options: [{ methods: ['{{METHOD1}}', '{{METHOD2}}'] }],
    errors: [{ message: m1 }, { message: m2 }],
  },
  {
    code: `{{SUITE}} ('1234', {{ES}}
      {{TESTSKIP}} ('4321', {{ES}}
        {{CODE}}
      });
    });`,
    options: [{ methods: ['{{METHOD1}}', '{{METHOD2}}'] }],
    errors: [{ message: m1 }, { message: m2 }],
  },
];

const stubs = [
  { STUB: 'sinon.stub' },
  { STUB: "sinon['stub']" },
  { STUB: 'stub' },
];

const codes = [
  {
    CODE: `{{STUB}}(window, '{{METHOD1}}');
  {{STUB}}(window, '{{METHOD2}}');`,
  },
  {
    CODE: `var stub = {{STUB}}(window, '{{METHOD1}}');
    {{STUB}}(window, '{{METHOD2}}', function () {});`,
  },
];

const methods = [
  { METHOD1: 'setTimeout', METHOD2: 'clearTimeout' },
  { METHOD1: 'setInterval', METHOD2: 'ClearInterval' },
];

const hooks = [
  { HOOK: 'before' },
  { HOOK: 'beforeEach' },
  { HOOK: 'after' },
  { HOOK: 'afterEach' },
];

const validTests = j
  .setTemplates(templates)
  .createCombos(['code'], hooks)
  .useCombosAsTemplates()
  .createCombos(['code'], codes)
  .useCombosAsTemplates()
  .createCombos(['code'], stubs)
  .useCombosAsTemplates()
  .createCombos(
    ['code', 'options.0.methods.@each', 'errors.@each.message'],
    methods
  )
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.es)
  .uniqueCombos()
  .getCombos()
  .map(function (c) {
    c.options[0].methods = ['someFakeMethod'];
    return c;
  });

const invalidTests = j
  .setTemplates(templates)
  .createCombos(['code'], hooks)
  .useCombosAsTemplates()
  .createCombos(['code'], codes)
  .useCombosAsTemplates()
  .createCombos(['code'], stubs)
  .useCombosAsTemplates()
  .createCombos(
    ['code', 'options.0.methods.@each', 'errors.@each.message'],
    methods
  )
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.es)
  .uniqueCombos()
  .getCombos();

ruleTester.run('disallow-stub-window', rule, {
  valid: ["stub(notWindow, 'setTimeout');"].concat(validTests),
  invalid: invalidTests,
});
