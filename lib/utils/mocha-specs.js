var suites = [
  'describe', 'context', // BDD
  'suite' // TDD
];

var suitesSkipped = [
  'describe.skip', 'xdescribe', 'xcontext', // BDD
  'suite.skip' // TDD
];

var tests = [
  'it', 'specify', // BDD
  'test' // TDD
];

var testsSkipped = [
  'xit', 'it.skip', 'xspecify', // BDD
  'test.skip' // TDD
];

var hooks = [
  'before', 'beforeEach', 'after', 'afterEach'
];

module.exports = {

  hooks: hooks,

  suites: suites,

  suitesSkipped: suitesSkipped,

  allSuites: suites.concat(suitesSkipped),

  tests: tests,

  testsSkipped: testsSkipped,

  allTests: tests.concat(testsSkipped),

  allBlocks: suites.concat(tests),

  allSkipped: suitesSkipped.concat(testsSkipped),

  all: suites.concat(suitesSkipped).concat(tests).concat(testsSkipped)

};