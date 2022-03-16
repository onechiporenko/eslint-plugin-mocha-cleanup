'use strict';
// Stryker disable all
const fast = process.argv[1].indexOf('@stryker-mutator') !== -1;

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
  mochaDatasets: fast ? combos[0] : combos,
  es: fast ? es.slice(0, 1) : es,
  hooks: fast ? hooks.slice(0, 1) : hooks,
};
