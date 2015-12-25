"use strict";

var rule = require("../../../lib/rules/disallow-stub-spy-restore-in-it"),
  RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();
ruleTester.run("disallow-stub-spy-restore-in-it", rule, {
  valid: [
    "sinon.restore();",

    "it('1234', function () {" +
      "var stub = '12345';" +
    "});",

    "it('1234', function () {" +
      "var spy = '12345';" +
    "});",

    "it('1234', function () {" +
      "var restore = '12345';" +
    "});",

    "it('1234', function () {" +
      "var a = restore.a;" +
    "});",

    "it('1234', function () {" +
      "var a = stub.a;" +
    "});",

    "it('1234', function () {" +
      "var a = spy.a;" +
    "});",

    "it('1234', function () {" +
      "this.stub = '1234';" +
    "});",

    "it('1234', function () {" +
      "this.stub.returns(1234);" +
    "});",

    "it('1234', function () {" +
      "this.stub.withArgs(1234).returns(4321);" +
    "});",

    "describe('1234', function () {" +
      "before(function() {" +
        "sinon.stub(); " +
        "sinon.spy(); " +
        "sinon.restore();" +
      "}); " +
      "it('4321', function () {});" +
    "});",

    "describe('1234', function () {" +
      "beforeEach(function() {" +
        "sinon.stub(); " +
        "sinon.spy(); " +
        "sinon.restore();" +
      "}); " +
      "it('4321', function () {});" +
    "});",

    "describe('1234', function () {" +
      "after(function() {" +
        "sinon.stub(); " +
        "sinon.spy(); " +
        "sinon.restore();" +
      "}); " +
      "it('4321', function () {});" +
    "});",

    "describe('1234', function () {" +
      "afterEach(function() {" +
        "sinon.stub(); " +
        "sinon.spy(); " +
        "sinon.restore();" +
      "}); " +
      "it('4321', function () {});" +
    "});",

    {
      code:
        "describe.skip('1234', function () {" +
          "it('12345', function () {" +
            "sinon.restore();" +
         "});" +
        "});",
      options: [true]
    },

    {
      code:
      "describe.skip('1234', function () {" +
        "it('12345', function () {" +
          "sinon.stub();" +
        "});" +
      "});",
      options: [true]
    },

    {
      code:
        "describe.skip('1234', function () {" +
          "it('12345', function () {" +
            "sinon.spy();" +
          "});" +
        "});",
      options: [true]
    },

    {
      code:
        "describe.skip('1234', function () { " +
          "[].forEach(function () {" +
            "it('12345', function () {" +
              "sinon.spy();" +
            "});" +
          "});" +
        "});",
      options: [true]
    },

    {
      code:
        "it.skip('12345', function () {" +
          "sinon.stub().withArgs().returns();" +
        "});",
      options: [true]
    }
  ],

  invalid: [
    {
      code:
        "it('12345', function () {" +
          "sinon.restore();" +
        "});",
      errors: [{message: "`restore` is not allowed to use inside `it`.", type: "Identifier"}]
    },
    {
      code:
        "it('12345', function () {" +
          "sinon.stub();" +
        "});",
      errors: [{message: "`stub` is not allowed to use inside `it`.", type: "Identifier"}]
    },
    {
      code:
        "it('12345', function () {" +
          "sinon.spy();" +
        "});",
      errors: [{message: "`spy` is not allowed to use inside `it`.", type: "Identifier"}]
    },
    {
      code:
        "describe('1234', function () { " +
          "[].forEach(function () {" +
            "it('12345', function () {" +
              "sinon.spy();" +
            "});" +
          "});" +
        "});",
      errors: [{message: "`spy` is not allowed to use inside `it`.", type: "Identifier"}]
    },
    {
      code:
        "it('12345', function () {" +
          "sinon.stub().withArgs().returns();" +
        "});",
      errors: [{message: "`stub` is not allowed to use inside `it`.", type: "Identifier"}]
    },
    {
      code:
        "describe.skip('1234', function () {" +
          "it('12345', function () {" +
            "sinon.restore();" +
          "});" +
        "});",
      errors: [{message: "`restore` is not allowed to use inside `it`.", type: "Identifier"}]
    },
    {
      code:
        "describe.skip('1234', function () {" +
          "it('12345', function () {" +
            "sinon.stub();" +
          "});" +
        "});",
      errors: [{message: "`stub` is not allowed to use inside `it`.", type: "Identifier"}]
    },
    {
      code:
        "describe.skip('1234', function () {" +
          "it('12345', function () {" +
            "sinon.spy();" +
          "});" +
        "});",
      errors: [{message: "`spy` is not allowed to use inside `it`.", type: "Identifier"}]
    },
    {
      code:
        "describe.skip('1234', function () { " +
          "[].forEach(function () {" +
            "it('12345', function () {" +
              "sinon.spy();" +
            "});" +
          "});" +
        "});",
      errors: [{message: "`spy` is not allowed to use inside `it`.", type: "Identifier"}]
    },
    {
      code:
        "it.skip('12345', function () {" +
          "sinon.stub().withArgs().returns();" +
        "});",
      errors: [{message: "`stub` is not allowed to use inside `it`.", type: "Identifier"}]
    }
  ]
});