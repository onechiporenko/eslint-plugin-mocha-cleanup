"use strict";

var rule = require("../../../lib/rules/no-assertions-in-loop"),
  RuleTester = require("eslint").RuleTester;
var testHelpers = require("../../../lib/utils/tests.js");
var ruleTester = new RuleTester();

// assertions -> loops -> testTemplates
// assertions -> testTemplates
// pLoops - loop wrappers

var loops = [
  {code: "for(var i = 0; i < 5; i++) {ASSERTION}"},
  {code: "for(var i in obj) {ASSERTION}"},
  {code: "while(i < 5) {ASSERTION}"},
  {code: "do {ASSERTION} while (i < 5)"}
];

var pLoops = [
  {
    LO: "for(var i = 0; i < 5; i++) {",
    OP: "}"
  },
  {
    LO: "for(var i in obj) {",
    OP: "}"
  },
  {
    LO: "while(i < 5) {",
    OP: "}"
  },
  {
    LO: "do {",
    OP: "} while (i < 5)"
  }
];

var assertions = [
  {ASSERTION: "assert.equal(1, 1);"},
  {ASSERTION: "expect(1).to.be.equal(1);"},
  {ASSERTION: "'1'.should.be.equal('1');"},
  {ASSERTION: "sinon.assert.called(a, 1);"}
];

var validTestTemplates = [
  {
    code:
      "LO" +
        "SUITE('1234', function () {" +
          "TEST('4321', function () {" +
            "ASSERTION" +
          "});" +
        "});" +
      "OP"
  },
  {
    code:
      "SUITE('1234', function () {" +
        "TEST('4321', function () {" +
          "ASSERTION" +
        "});" +
      "});"
  },
  {
    code:
      "SUITE('1234', function () {" +
        "TESTSKIP('4321', function () {" +
          "LOOP" +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        "TEST('4321', function () {" +
          "LOOP" +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITE('1234', function () {" +
        "TESTSKIP('4321', function () {" +
          "obj.forEach(function () {" +
            "ASSERTION" +
          "});" +
        "});" +
      "});",
    options: [{skipSkipped: true, extraMemberExpression: ["forEach"]}]
  }
];

var invalidTestTemplates = [
  {
    code:
      "SUITE('1234', function () {" +
        "TEST('4321', function () {" +
          "LOOP" +
        "});" +
      "});",
    errors: [
      {message: "Assertions should not be used in loops."}
    ]
  },
  {
    code:
      "SUITE('1234', function () {" +
        "TESTSKIP('4321', function () {" +
          "LOOP" +
        "});" +
      "});",
    errors: [
      {message: "Assertions should not be used in loops."}
    ]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        "TEST('4321', function () {" +
          "LOOP" +
        "});" +
      "});",
    errors: [
      {message: "Assertions should not be used in loops."}
    ]
  },
  {
    code:
      "SUITE('1234', function () {" +
        "TESTSKIP('4321', function () {" +
          "obj.forEach(function () {" +
            "ASSERTION" +
          "});" +
        "});" +
      "});",
    options: [{extraMemberExpression: ["forEach"]}],
    errors: [
      {message: "Assertions should not be used in loops."}
    ]
  }
];

var loopsWithAssertions = testHelpers.getCombos(loops, assertions);
loopsWithAssertions.forEach(function (item) {item.LOOP = item.code;});

var combosWithValidAssertions = testHelpers.getCombos(testHelpers.getCombos(testHelpers.getCombos(validTestTemplates, pLoops), loopsWithAssertions), assertions);
var combosWithInvalidAssertions = testHelpers.getCombos(testHelpers.getCombos(invalidTestTemplates, loopsWithAssertions), assertions);

ruleTester.run("no-assertions-in-loop", rule, {
  valid: testHelpers.getCombos(combosWithValidAssertions),
  invalid: testHelpers.getCombos(combosWithInvalidAssertions)
});
