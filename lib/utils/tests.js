'use strict';

const fast = process.argv[5] === '--fast';

const combos = [
  {
    SUITESKIP: 'describe.skip',
    TESTSKIP: 'it.skip',
    SUITE: 'describe',
    TEST: 'it',
  },
  { SUITESKIP: 'xcontext', TESTSKIP: 'it.skip', SUITE: 'context', TEST: 'it' },
  {
    SUITESKIP: 'xcontext',
    TESTSKIP: 'xspecify',
    SUITE: 'context',
    TEST: 'specify',
  },
  { SUITESKIP: 'xdescribe', TESTSKIP: 'xit', SUITE: 'describe', TEST: 'it' },
  { SUITESKIP: 'xcontext', TESTSKIP: 'xit', SUITE: 'context', TEST: 'it' },
  {
    SUITESKIP: 'suite.skip',
    TESTSKIP: 'test.skip',
    SUITE: 'suite',
    TEST: 'test',
  },
];

const es = [{ ES: 'function () {' }, { ES: '() => {' }];

const hooks = [
  { HOOK: 'before' },
  { HOOK: 'beforeEach' },
  { HOOK: 'after' },
  { HOOK: 'afterEach' },
];

module.exports = {
  mochaDatasets: fast ? /* istanbul ignore next */ combos[0] : combos,
  es,
  hooks,
};
