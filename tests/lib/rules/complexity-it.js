"use strict";

var rule = require("../../../lib/rules/complexity-it"),
  RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();

ruleTester.run("complexity-it", rule, {
  valid: [
    {
      code:
        "describe('3421', function () {" +
          "it('1234', function () { " +
            "var result = myObj.coolFunc(1, 2);" +
            "var expected = myTestCase.expected[0];" +
            "expect(result).to.be.equal(expected);" +
          "});" +
        "});",
      options: [9]
    },
    {
      code:
        "describe.skip('3421', function () {" +
          "it('1234', function () { " +
            "sinon.assert.calledOn(sp, {});" +
          "});" +
        "});",
      options: [0, true]
    },
    {
      code:
        "it.skip('1234', function () { " +
          "sinon.assert.calledOn(sp, {});" +
        "});",
      options: [0, true]
    },
    {
      code:
        "describe.skip('3421', function () {" +
          "it('1234', function () { " +
            "expect(func()).to.be.equal(1);" +
          "});" +
        "});",
      options: [0, true]
    },
    {
      code:
        "it.skip('1234', function () { " +
          "expect(func()).to.be.equal(1);" +
        "});",
      options: [0, true]
    },
    {
      code:
        "describe.skip('3421', function () {" +
          "it('1234', function () { " +
            "assert.equal(func(), 1, '4321');" +
          "});" +
        "});",
      options: [0, true]
    },
    {
      code:
        "it.skip('1234', function () { " +
          "assert.equal(func(), 1, '4321');" +
        "});",
      options: [0, true]
    },
    {
      code:
        "describe.skip('3421', function () {" +
          "it('1234', function () { " +
            "func().should.be.equal(1);" +
          "});" +
        "});",
      options: [0, true]
    },
    {
      code:
        "it.skip('1234', function () { " +
          "func().should.be.equal(1);" +
        "});",
      options: [0, true]
    },
    {
      code:
        "it.skip('1234', function () { " +
          "expect(func()).to.be.been.is.that.which.and.has.have.with.at.of.same.equal(1);" +
        "});",
      options: [0, true]
    },
    {
      code:
        "describe.skip('4321', function () {" +
          "it('1234', function () { " +
            "expect(func()).to.be.been.is.that.which.and.has.have.with.at.of.same.equal(1);" +
          "});"+
        "});",
      options: [0, true]
    }
  ],

  invalid: [
    {
      code:
        "it('1234', function () { " +
          "expect(func()).to.be.equal(1);" +
        "});",
      options: [0],
      errors: [{ message: "`it` has a complexity of 4. Maximum allowed is 0.", type: "CallExpression"}]
    },
    {
      code:
        "it('1234', function () { " +
          "expect(func()).to.be.been.is.that.which.and.has.have.with.at.of.same.equal(1);" +
        "});",
      options: [0],
      errors: [{ message: "`it` has a complexity of 4. Maximum allowed is 0.", type: "CallExpression"}]
    },
    {
      code:
        "it('1234', function () { " +
          "assert.equal(func(), 1, '4321');" +
        "});",
      options: [0],
      errors: [{ message: "`it` has a complexity of 3. Maximum allowed is 0.", type: "CallExpression"}]
    },
    {
      code:
        "it('1234', function () { " +
          "func().should.be.equal(1);" +
        "});",
      options: [0],
      errors: [{ message: "`it` has a complexity of 4. Maximum allowed is 0.", type: "CallExpression"}]
    },
    {
      code:
        "it('1234', function () { " +
          "sinon.assert.calledOn(sp, {});" +
        "});",
      options: [0],
      errors: [{ message: "`it` has a complexity of 3. Maximum allowed is 0.", type: "CallExpression"}]
    }
  ]
});