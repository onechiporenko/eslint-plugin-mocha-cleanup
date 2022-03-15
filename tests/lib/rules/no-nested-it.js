'use strict';

const rule = require('../../../lib/rules/no-nested-it');
const { RuleTester } = require('eslint');
const testHelpers = require('../../../lib/utils/tests.js');
const ruleTester = new RuleTester({ env: { es6: true } });

const Jsonium = require('jsonium');
const j = new Jsonium();

const validTestTemplates = [
  {
    code: `{{TEST}}('123', {{ES}}
    });
    {{SUITE}}('321', {{ES}}
      {{TEST}}('123', {{ES}}
      });
    });`,
  },
  {
    code: `{{SUITE}}('321', {{ES}}
      {{TEST}}('123', {{ES}}
        some.it;
      });
    });`,
  },
  {
    code: `{{SUITE}}('321', {{ES}}
      {{TEST}}('123', {{ES}}
        it.abc();
      });
    });`,
  },
  {
    code: `{{SUITE}}('321', {{ES}}
      {{TEST}}('123', {{ES}}
        abc.it();
      });
    });`,
  },
  {
    code: `{{SUITE}}('321', {{ES}}
      {{TEST}}('123', {{ES}}
        abc.it('33', {{ES}}
        });
      });
    });`,
  },
  {
    code: `{{SUITE}}('321', {{ES}}
      {{TEST}}('123', {{ES}}
      });
    });
    {{SUITE}}('4321', {{ES}}
      {{TEST}}('123', {{ES}}
      });
    });`,
  },
  {
    code: `{{SUITE}}('4321', {{ES}}
      {{SUITE}}('321', {{ES}}
        {{TEST}}('123', {{ES}}
        });
      });
      {{TEST}}('123', {{ES}}
      });
    });`,
  },
  {
    code: `{{SUITESKIP}}('1234', {{ES}}
      {{TEST}}('1234', {{ES}}
        {{TEST}}('4321', {{ES}}
        });
      });
    });`,
    options: [{ skipSkipped: true }],
  },
  {
    code: `{{SUITE}}('1234', {{ES}}
      {{TESTSKIP}}('1234', {{ES}}
        {{TEST}}('4321', {{ES}}
        });
      });
    });`,
    options: [{ skipSkipped: true }],
  },
  {
    code: `{{SUITESKIP}}('1234', {{ES}}
      {{TEST}}('1234', {{ES}}
        {{TEST}}('4321', {{ES}}
          {{TEST}}('4321', {{ES}}
          });
        });
      });
    });`,
    options: [{ skipSkipped: true }],
  },
  {
    code: `{{SUITE}}('1234', {{ES}}
      {{TESTSKIP}}('1234', {{ES}}
        {{TEST}}('4321', {{ES}}
          {{TEST}}('4321', {{ES}}
          });
        });
      });
    });`,
    options: [{ skipSkipped: true }],
  },
];

const invalidTestTemplates = [
  {
    code: `{{SUITE}}('1234', {{ES}}
      {{TEST}}('1234', {{ES}}
        {{TEST}}('4321', {{ES}}
        });
      });
    });`,
    errors: [
      {
        message:
          'Nested tests are not allowed. Only nested suites are allowed.',
        type: 'CallExpression',
      },
    ],
  },
  {
    code: `{{SUITE}}('1234', {{ES}}
      {{TEST}}('1234', {{ES}}
        {{TEST}}('4321', {{ES}}
          {{TEST}}('4321', {{ES}}
          });
        });
      });
    });`,
    errors: [
      {
        message:
          'Nested tests are not allowed. Only nested suites are allowed.',
        type: 'CallExpression',
      },
      {
        message:
          'Nested tests are not allowed. Only nested suites are allowed.',
        type: 'CallExpression',
      },
    ],
  },
  {
    code: `{{SUITESKIP}}('1234', {{ES}}
      {{TEST}}('1234', {{ES}}
        {{TEST}}('4321', {{ES}}
        });
      });
    });`,
    errors: [
      {
        message:
          'Nested tests are not allowed. Only nested suites are allowed.',
        type: 'CallExpression',
      },
    ],
  },
  {
    code: `{{SUITESKIP}}('1234', {{ES}}
      {{SUITE}}('1234', {{ES}}
        {{TEST}}('1234', {{ES}}
         {{TEST}}('4321', {{ES}}
         });
        });
      });
    });`,
    errors: [
      {
        message:
          'Nested tests are not allowed. Only nested suites are allowed.',
        type: 'CallExpression',
      },
    ],
  },
  {
    code: `{{SUITE}}('1234', {{ES}}
      {{TESTSKIP}}('1234', {{ES}}
        {{TEST}}('4321', {{ES}}
        });
      });
    });`,
    errors: [
      {
        message:
          'Nested tests are not allowed. Only nested suites are allowed.',
        type: 'CallExpression',
      },
    ],
  },
  {
    code: `{{SUITESKIP}}('1234', {{ES}}
      {{TEST}}('1234', {{ES}}
        {{TEST}}('4321', {{ES}}
          {{TEST}}('4321', {{ES}}
          });
        });
      });
    });`,
    errors: [
      {
        message:
          'Nested tests are not allowed. Only nested suites are allowed.',
        type: 'CallExpression',
      },
      {
        message:
          'Nested tests are not allowed. Only nested suites are allowed.',
        type: 'CallExpression',
      },
    ],
  },
  {
    code: `{{SUITE}}('1234', {{ES}}
      {{TESTSKIP}}('1234', {{ES}}
        {{TEST}}('4321', {{ES}}
          {{TEST}}('4321', {{ES}}
          });
        });
      });
    });`,
    errors: [
      {
        message:
          'Nested tests are not allowed. Only nested suites are allowed.',
        type: 'CallExpression',
      },
      {
        message:
          'Nested tests are not allowed. Only nested suites are allowed.',
        type: 'CallExpression',
      },
    ],
  },
];

const validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(['code'], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.es)
  .uniqueCombos()
  .getCombos();

j.clearTemplates().clearCombos();

const invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(['code', 'errors.@each.message'], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(['code'], testHelpers.es)
  .uniqueCombos()
  .getCombos();

ruleTester.run('no-nested-it', rule, {
  valid: validTests,
  invalid: invalidTests,
});
