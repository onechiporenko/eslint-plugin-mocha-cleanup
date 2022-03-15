'use strict';

const rule = require('../../../lib/rules/no-empty-title');
const { RuleTester } = require('eslint');
const testHelpers = require('../../../lib/utils/tests.js');
const ruleTester = new RuleTester({ env: { es6: true } });

const Jsonium = require('jsonium');
const j = new Jsonium();

const titles = [{ TITLE: "''" }, { TITLE: "'    '" }, { TITLE: "'\t'" }];

const validTestTemplates = [
  {
    code: `{{TEST}}('some title', {{ES}}
    });`,
  },
  {
    code: `{{TEST}}(123, {{ES}}
    });`,
  },
  {
    code: `var a = '12';
    {{TEST}}(a, {{ES}}
    });`,
  },
  {
    code: `function a() {
      return sinon.stub()
    };
    {{TEST}}('some title', {{ES}}
    });`,
  },
  {
    code: `{{TEST}}('1234', {{ES}}
    });
    sinon.stub();`,
  },
  {
    code: `var a = {{ES}}
      return '123';
    };
    {{TEST}}(a(), {{ES}}
    });`,
  },
  {
    code: `{{SUITE}}('title', {{ES}}
      {{TEST}}('some title', {{ES}}
      });
    });`,
  },
  {
    code: `var a = '12';
    {{SUITE}}(a, {{ES}}
      {{TEST}}('some title', {{ES}}
      });
    });`,
  },
  {
    code: `var a = {{ES}}
      return '123';
    };
    {{SUITE}}(a(), {{ES}}
      {{TEST}}('some title', {{ES}}});
    });`,
  },
  {
    code: `{{TESTSKIP}}({{TITLE}}, {{ES}}
    });`,
    options: [{ skipSkipped: true }],
  },
  {
    code: `{{SUITESKIP}}({{TITLE}}, {{ES}}
      {{TEST}}('some title', {{ES}}
      });
    });`,
    options: [{ skipSkipped: true }],
  },
];

const invalidTestTemplates = [
  {
    code: `{{TEST}}({{TITLE}}, {{ES}}
    });`,
    errors: [
      {
        message: 'Empty title is not allowed for `{{TEST}}`.',
        type: 'CallExpression',
      },
    ],
  },
  {
    code: `{{SUITESKIP}}('123', {{ES}}
      {{TEST}}({{TITLE}}, {{ES}}
      });
    });`,
    errors: [
      {
        message: 'Empty title is not allowed for `{{TEST}}`.',
        type: 'CallExpression',
      },
    ],
  },
  {
    code: `{{SUITE}}({{TITLE}}, {{ES}}
      {{TEST}}('some title', {{ES}}
      });
    });`,
    errors: [
      {
        message: 'Empty title is not allowed for `{{SUITE}}`.',
        type: 'CallExpression',
      },
    ],
  },
  {
    code: `{{TESTSKIP}}({{TITLE}}, {{ES}}
    });`,
    errors: [
      {
        message: 'Empty title is not allowed for `{{TESTSKIP}}`.',
        type: 'CallExpression',
      },
    ],
  },
  {
    code: `{{SUITESKIP}}({{TITLE}}, {{ES}}
      {{TEST}}('some title', {{ES}}
      });
    });`,
    errors: [
      {
        message: 'Empty title is not allowed for `{{SUITESKIP}}`.',
        type: 'CallExpression',
      },
    ],
  },
];

const validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(['code'], titles)
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.es)
  .uniqueCombos()
  .getCombos();

j.clearTemplates().clearCombos();

const invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(['code'], titles)
  .useCombosAsTemplates()
  .createCombos(['code', 'errors.@each.message'], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.es)
  .uniqueCombos()
  .getCombos();

ruleTester.run('no-empty-title', rule, {
  valid: ["it('123', function () {" + "abc['']();" + '});'].concat(validTests),
  invalid: invalidTests,
});
