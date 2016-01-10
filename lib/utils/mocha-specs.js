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

module.exports = {

  suites: suites,

  suitesSkipped: suitesSkipped,

  allSuites: suites.concat(suitesSkipped),

  tests: tests,

  testsSkipped: testsSkipped,

  allTests: tests.concat(testsSkipped),

  allBlocks: suites.concat(tests),

  allSkipped: suitesSkipped.concat(testsSkipped)

};