"use strict";

var rule = require("../../../lib/rules/no-eql-primitives"),
  RuleTester = require("eslint").RuleTester;
var testHelpers = require("../../../lib/utils/tests.js");
var ruleTester = new RuleTester();

var assertions = [
  {INVALID_ASSERTION: "assert.deepEqual(a, 1);", ASSERTION: "", IN_MESSAGE: "assert.deepEqual"},
  {INVALID_ASSERTION: "assert.deepEqual(a, true);", ASSERTION: "", IN_MESSAGE: "assert.deepEqual"},
  {INVALID_ASSERTION: "assert.deepEqual(a, '');", ASSERTION: "", IN_MESSAGE: "assert.deepEqual"},
  {INVALID_ASSERTION: "assert.deepEqual(a, null);", ASSERTION: "", IN_MESSAGE: "assert.deepEqual"},
  {INVALID_ASSERTION: "assert.notDeepEqual(a, 1);", ASSERTION: "", IN_MESSAGE: "assert.notDeepEqual"},
  {INVALID_ASSERTION: "assert.notDeepEqual(a, true);", ASSERTION: "", IN_MESSAGE: "assert.notDeepEqual"},
  {INVALID_ASSERTION: "assert.notDeepEqual(a, '');", ASSERTION: "", IN_MESSAGE: "assert.notDeepEqual"},
  {INVALID_ASSERTION: "assert.notDeepEqual(a, null);", ASSERTION: "", IN_MESSAGE: "assert.notDeepEqual"},
  {INVALID_ASSERTION: "expect(a).to.be.eql(1);", ASSERTION: "", IN_MESSAGE: ".eql"},
  {INVALID_ASSERTION: "expect(a).to.be.eql(true);", ASSERTION: "", IN_MESSAGE: ".eql"},
  {INVALID_ASSERTION: "expect(a).to.be.eql('');", ASSERTION: "", IN_MESSAGE: ".eql"},
  {INVALID_ASSERTION: "expect(a).to.be.eql(null);", ASSERTION: "", IN_MESSAGE: ".eql"},
  {INVALID_ASSERTION: "expect(a).to.be.deep.equal(1);", ASSERTION: "", IN_MESSAGE: ".deep.equal"},
  {INVALID_ASSERTION: "expect(a).to.be.deep.equal(true);", ASSERTION: "", IN_MESSAGE: ".deep.equal"},
  {INVALID_ASSERTION: "expect(a).to.be.deep.equal('');", ASSERTION: "", IN_MESSAGE: ".deep.equal"},
  {INVALID_ASSERTION: "expect(a).to.be.deep.equal(null);", ASSERTION: "", IN_MESSAGE: ".deep.equal"},
  {INVALID_ASSERTION: "a.should.be.eql(1);", ASSERTION: "", IN_MESSAGE: ".eql"},
  {INVALID_ASSERTION: "a.should.be.eql(true);", ASSERTION: "", IN_MESSAGE: ".eql"},
  {INVALID_ASSERTION: "a.should.be.eql('');", ASSERTION: "", IN_MESSAGE: ".eql"},
  {INVALID_ASSERTION: "a.should.be.eql(null);", ASSERTION: "", IN_MESSAGE: ".eql"},
  {INVALID_ASSERTION: "a.should.be.deep.equal(1);", ASSERTION: "", IN_MESSAGE: ".deep.equal"},
  {INVALID_ASSERTION: "a.should.be.deep.equal(true);", ASSERTION: "", IN_MESSAGE: ".deep.equal"},
  {INVALID_ASSERTION: "a.should.be.deep.equal('');", ASSERTION: "", IN_MESSAGE: ".deep.equal"},
  {INVALID_ASSERTION: "a.should.be.deep.equal(null);", ASSERTION: "", IN_MESSAGE: ".deep.equal"},
  {INVALID_ASSERTION: "", ASSERTION: "assert.deepEqual(a, {});"},
  {INVALID_ASSERTION: "", ASSERTION: "assert.deepEqual(a, b);"},
  {INVALID_ASSERTION: "", ASSERTION: "assert.notDeepEqual(a, {});"},
  {INVALID_ASSERTION: "", ASSERTION: "assert.notDeepEqual(a, b);"},
  {INVALID_ASSERTION: "", ASSERTION: "expect(a).to.be.eql({});"},
  {INVALID_ASSERTION: "", ASSERTION: "expect(a).to.be.eql(b);"},
  {INVALID_ASSERTION: "", ASSERTION: "a.should.be.eql({});"},
  {INVALID_ASSERTION: "", ASSERTION: "a.should.be.eql(b);"}
];

var validTestTemplates = [
  {
    code:
      "TEST('123', function () {" +
        "ASSERTION" +
      "});"
  },
  {
    code:
      "SUITESKIP('123', function () {" +
        "TEST('123', function () {" +
          "INVALID_ASSERTION" +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "SUITE('123', function () {" +
        "TESTSKIP('123', function () {" +
          "INVALID_ASSERTION" +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  }
];

var invalidTestTemplates = [
  {
    code:
      "TEST('123', function () {" +
        "INVALID_ASSERTION" +
      "});",
    errors: [
      {message: "`IN_MESSAGE` should not be used with primitives.", type: "MemberExpression"}
    ]
  },
  {
    code:
      "TESTSKIP('123', function () {" +
        "INVALID_ASSERTION" +
      "});",
    errors: [
      {message: "`IN_MESSAGE` should not be used with primitives.", type: "MemberExpression"}
    ]
  },
  {
    code:
      "SUITESKIP('123', function () {" +
        "TEST('123', function () {" +
          "INVALID_ASSERTION" +
        "});" +
      "});",
    errors: [
      {message: "`IN_MESSAGE` should not be used with primitives.", type: "MemberExpression"}
    ]
  }
];

var combosWithValidAssertions = testHelpers.getCombos(validTestTemplates, assertions);

// tests without invalid assertions should not be here
var combosWithInvalidAssertions = testHelpers.getCombos(invalidTestTemplates, assertions.filter(function (a) {
  return !!a.INVALID_ASSERTION;
}));

ruleTester.run("no-eql-primitives", rule, {
  valid: testHelpers.getCombos(combosWithValidAssertions),
  invalid: testHelpers.getCombos(combosWithInvalidAssertions)
});