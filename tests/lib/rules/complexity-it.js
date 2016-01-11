"use strict";

var testHelpers = require("../../../lib/utils/tests.js");

var rule = require("../../../lib/rules/complexity-it"),
  RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();

var validTestTemplates = [
  {
    code:
      "SUITE('3421', function () {" +
        "TEST('1234', function () { " +
          "var result = myObj.coolFunc(1, 2);" +
          "var expected = myTestCase.expected[0];" +
          "expect(result).to.be.equal(expected);" +
        "});" +
      "});",
    options: [{maxAllowedComplexity: 9}]
  },
  {
    code:
      "SUITESKIP('3421', function () {" +
        "TEST('1234', function () { " +
          "sinon.assert.calledOn(sp, {});" +
        "});" +
      "});",
    options: [{maxAllowedComplexity: 0, skipSkipped: true}]
  },
  {
    code:
      "TESTSKIP('1234', function () { " +
        "sinon.assert.calledOn(sp, {});" +
      "});",
    options: [{maxAllowedComplexity: 0, skipSkipped: true}]
  },
  {
    code:
      "SUITESKIP('3421', function () {" +
        "TEST('1234', function () { " +
          "expect(func()).to.be.equal(1);" +
        "});" +
      "});",
    options: [{maxAllowedComplexity: 0, skipSkipped: true}]
  },
  {
    code:
      "TESTSKIP('1234', function () { " +
        "expect(func()).to.be.equal(1);" +
      "});",
    options: [{maxAllowedComplexity: 0, skipSkipped: true}]
  },
  {
    code:
      "SUITESKIP('3421', function () {" +
        "TEST('1234', function () { " +
          "assert.equal(func(), 1, '4321');" +
        "});" +
      "});",
    options: [{maxAllowedComplexity: 0, skipSkipped: true}]
  },
  {
    code:
      "TESTSKIP('1234', function () { " +
        "assert.equal(func(), 1, '4321');" +
      "});",
    options: [{maxAllowedComplexity: 0, skipSkipped: true}]
  },
  {
    code:
      "SUITESKIP('3421', function () {" +
        "TEST('1234', function () { " +
          "func().should.be.equal(1);" +
        "});" +
      "});",
    options: [{maxAllowedComplexity: 0, skipSkipped: true}]
  },
  {
    code:
      "TESTSKIP('1234', function () { " +
        "func().should.be.equal(1);" +
      "});",
    options: [{maxAllowedComplexity: 0, skipSkipped: true}]
  },
  {
    code:
      "TESTSKIP('1234', function () { " +
        "expect(func()).to.be.been.is.that.which.and.has.have.with.at.of.same.equal(1);" +
      "});",
    options: [{maxAllowedComplexity: 0, skipSkipped: true}]
  },
  {
    code:
      "SUITESKIP('4321', function () {" +
        "TEST('1234', function () { " +
          "expect(func()).to.be.been.is.that.which.and.has.have.with.at.of.same.equal(1);" +
        "});"+
      "});",
    options: [{maxAllowedComplexity: 0, skipSkipped: true}]
  }
];

var invalidTestTemplates = [
  {
    code:
      "TEST('1234', function () { " +
        "expect(func()).to.be.equal(1);" +
      "});",
    options: [{maxAllowedComplexity: 0}],
    errors: [{ message: "`TEST` has a complexity of 4. Maximum allowed is 0.", type: "CallExpression"}]
  },
  {
    code:
      "TEST('1234', function () { " +
        "expect(func()).to.be.been.is.that.which.and.has.have.with.at.of.same.equal(1);" +
      "});",
    options: [{maxAllowedComplexity: 0}],
    errors: [{ message: "`TEST` has a complexity of 4. Maximum allowed is 0.", type: "CallExpression"}]
  },
  {
    code:
      "TEST('1234', function () { " +
        "assert.equal(func(), 1, '4321');" +
      "});",
    options: [{maxAllowedComplexity: 0}],
    errors: [{ message: "`TEST` has a complexity of 3. Maximum allowed is 0.", type: "CallExpression"}]
  },
  {
    code:
      "TEST('1234', function () { " +
        "func().should.be.equal(1);" +
      "});",
    options: [{maxAllowedComplexity: 0}],
    errors: [{ message: "`TEST` has a complexity of 4. Maximum allowed is 0.", type: "CallExpression"}]
  },
  {
    code:
      "TEST('1234', function () { " +
        "sinon.assert.calledOn(sp, {});" +
      "});",
    options: [{maxAllowedComplexity: 0}],
    errors: [{ message: "`TEST` has a complexity of 3. Maximum allowed is 0.", type: "CallExpression"}]
  }
];

ruleTester.run("complexity-it", rule, {
  valid: testHelpers.getCombos(validTestTemplates),
  invalid: testHelpers.getCombos(invalidTestTemplates)
});