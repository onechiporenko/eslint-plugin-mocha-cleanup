var combos = [
  {SUITESKIP: 'describe.skip', TESTSKIP: 'it.skip', SUITE: 'describe', TEST: 'it'},
  {SUITESKIP: 'xcontext', TESTSKIP: 'it.skip', SUITE: 'context', TEST: 'it'},
  {SUITESKIP: 'xcontext', TESTSKIP: 'xspecify', SUITE: 'context', TEST: 'specify'},
  {SUITESKIP: 'xdescribe', TESTSKIP: 'xit', SUITE: 'describe', TEST: 'it' },
  {SUITESKIP: 'xcontext', TESTSKIP: 'xit', SUITE: 'context', TEST: 'it' },
  {SUITESKIP: 'suite.skip', TESTSKIP: 'test.skip', SUITE: 'suite', TEST: 'test' }
];

module.exports = {
  mochaDatasets: combos
};