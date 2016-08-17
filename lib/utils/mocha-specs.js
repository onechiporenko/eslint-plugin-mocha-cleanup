var suites = [
  "describe", "context", "describe.only", "context.only", // BDD
  "Feature", "Scenario", "Feature.only", "Scenario.only", // Mocha Cakes 2
  "suite", "suite.only" // TDD
];

var suitesSkipped = [
  "describe.skip", "xdescribe", "xcontext", // BDD
  "Feature.skip", "Scenario.skip", // Mocha Cakes 2
  "suite.skip" // TDD
];

var tests = [
  "it", "specify", "it.only", "specify.only", // BDD
  "Then", "And", "But", "Then.only", "And.only", "But.only", // Mocha Cakes 2
  "test", "test.only" // TDD
];

var testsSkipped = [
  "xit", "it.skip", "xspecify", // BDD
  "Then.skip", "And.skip", "But.skip", // Mocha Cakes 2
  "test.skip" // TDD
];

var hooks = [
  "before", "beforeEach", "after", "afterEach"
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