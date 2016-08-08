var suites = [
  "describe", "context", // BDD
  "Feature", "Scenario", // Mocha Cakes 2
  "suite" // TDD
];

var suitesSkipped = [
  "describe.skip", "xdescribe", "xcontext", // BDD
  "Feature.skip", "Scenario.skip", // Mocha Cakes 2
  "suite.skip" // TDD
];

var tests = [
  "it", "specify", // BDD
  "Given", "Then", "And", "But", // Mocha Cakes 2
  "test" // TDD
];

var testsSkipped = [
  "xit", "it.skip", "xspecify", // BDD
  "Given.skip", "Then.skip", "And.skip", "But.skip", // Mocha Cakes 2
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