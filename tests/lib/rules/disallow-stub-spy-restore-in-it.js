"use strict";

var rule = require("../../../lib/rules/disallow-stub-spy-restore-in-it"),
  RuleTester = require("eslint").RuleTester;
var testHelpers = require("../../../lib/utils/tests.js");
var ruleTester = new RuleTester();
var Jsonium = require('jsonium');
var j = new Jsonium();


var validTestTemplates = [
  {
    code: "sinon.restore();"
  },
  {
    code: "sinon['restore']();"
  },
  {
    code:
      "{{TEST}}('1234', function () {" +
        "var stub = '12345';" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', function () {" +
        "var spy = '12345';" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', function () {" +
        "var restore = '12345';" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', function () {" +
        "var a = restore.a;" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', function () {" +
        "var a = stub.a;" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', function () {" +
        "var a = spy.a;" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', function () {" +
        "this.stub = '1234';" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', function () {" +
        "this['stub'] = '1234';" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', function () {" +
        "this.stub.returns(1234);" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', function () {" +
        "this['stub'].returns(1234);" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', function () {" +
        "this.stub.withArgs(1234).returns(4321);" +
      "});"
  },
  {
    code:
      "{{TEST}}('1234', function () {" +
        "this['stub'].withArgs(1234).returns(4321);" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "before(function() {" +
          "sinon.stub(); " +
          "sinon.spy(); " +
          "sinon.restore();" +
        "}); " +
        "{{TEST}}('4321', function () {});" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "before(function() {" +
          "sinon['stub'](); " +
          "sinon['spy'](); " +
          "sinon['restore']();" +
        "}); " +
        "{{TEST}}('4321', function () {});" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "beforeEach(function() {" +
          "sinon.stub(); " +
          "sinon.spy(); " +
          "sinon.restore();" +
        "}); " +
        "{{TEST}}('4321', function () {});" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "beforeEach(function() {" +
          "sinon['stub'](); " +
          "sinon['spy'](); " +
          "sinon['restore']();" +
        "}); " +
        "{{TEST}}('4321', function () {});" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "after(function() {" +
          "sinon.stub(); " +
          "sinon.spy(); " +
          "sinon.restore();" +
        "}); " +
        "{{TEST}}('4321', function () {});" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "after(function() {" +
          "sinon['stub'](); " +
          "sinon['spy'](); " +
          "sinon['restore']();" +
        "}); " +
        "{{TEST}}('4321', function () {});" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "afterEach(function() {" +
          "sinon.stub(); " +
          "sinon.spy(); " +
          "sinon.restore();" +
        "}); " +
        "{{TEST}}('4321', function () {});" +
      "});"
  },
  {
    code:
      "{{SUITE}}('1234', function () {" +
        "afterEach(function() {" +
          "sinon['stub'](); " +
          "sinon['spy'](); " +
          "sinon['restore']();" +
        "}); " +
        "{{TEST}}('4321', function () {});" +
      "});"
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{TEST}}('12345', function () {" +
          "sinon.restore();" +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{TEST}}('12345', function () {" +
          "sinon['restore']();" +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{TEST}}('12345', function () {" +
          "sinon.stub();" +
        "});" +
     "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{TEST}}('12345', function () {" +
          "sinon['stub']();" +
        "});" +
     "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{TEST}}('12345', function () {" +
          "sinon.spy();" +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{TEST}}('12345', function () {" +
          "sinon['spy']();" +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () { " +
        "[].forEach(function () {" +
          "{{TEST}}('12345', function () {" +
            "sinon.spy();" +
          "});" +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () { " +
        "[].forEach(function () {" +
          "{{TEST}}('12345', function () {" +
            "sinon['spy']();" +
          "});" +
        "});" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{TESTSKIP}}('12345', function () {" +
        "sinon.stub().withArgs().returns();" +
      "});",
    options: [{skipSkipped: true}]
  },
  {
    code:
      "{{TESTSKIP}}('12345', function () {" +
        "sinon['stub']().withArgs().returns();" +
      "});",
    options: [{skipSkipped: true}]
  }
];

var invalidTestTemplates = [
  {
    code:
      "{{TEST}}('12345', function () {" +
        "sinon.restore();" +
      "});",
    errors: [{message: "`restore` is not allowed to use inside `{{TEST}}`.", type: "Identifier"}]
  },
  {
    code:
      "{{TEST}}('12345', function () {" +
        "sinon['restore']();" +
      "});",
    errors: [{message: "`restore` is not allowed to use inside `{{TEST}}`.", type: "Literal"}]
  },
  {
    code:
      "{{TEST}}('12345', function () {" +
        "sinon.stub();" +
      "});",
    errors: [{message: "`stub` is not allowed to use inside `{{TEST}}`.", type: "Identifier"}]
  },
  {
    code:
      "{{TEST}}('12345', function () {" +
        "sinon['stub']();" +
      "});",
    errors: [{message: "`stub` is not allowed to use inside `{{TEST}}`.", type: "Literal"}]
  },
  {
    code:
      "{{TEST}}('12345', function () {" +
        "sinon.spy();" +
      "});",
    errors: [{message: "`spy` is not allowed to use inside `{{TEST}}`.", type: "Identifier"}]
  },
  {
    code:
      "{{SUITE}}('1234', function () { " +
        "[].forEach(function () {" +
          "{{TEST}}('12345', function () {" +
            "sinon.spy();" +
          "});" +
        "});" +
      "});",
    errors: [{message: "`spy` is not allowed to use inside `{{TEST}}`.", type: "Identifier"}]
  },
  {
    code:
      "{{SUITE}}('1234', function () { " +
        "[].forEach(function () {" +
          "{{TEST}}('12345', function () {" +
            "sinon['spy']();" +
          "});" +
        "});" +
      "});",
    errors: [{message: "`spy` is not allowed to use inside `{{TEST}}`.", type: "Literal"}]
  },
  {
    code:
      "{{TEST}}('12345', function () {" +
        "sinon.stub().withArgs().returns();" +
      "});",
    errors: [{message: "`stub` is not allowed to use inside `{{TEST}}`.", type: "Identifier"}]
  },
  {
    code:
      "{{TEST}}('12345', function () {" +
        "sinon['stub']().withArgs().returns();" +
      "});",
    errors: [{message: "`stub` is not allowed to use inside `{{TEST}}`.", type: "Literal"}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{TEST}}('12345', function () {" +
          "sinon.restore();" +
        "});" +
      "});",
    errors: [{message: "`restore` is not allowed to use inside `{{TEST}}`.", type: "Identifier"}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{TEST}}('12345', function () {" +
          "sinon['restore']();" +
        "});" +
      "});",
    errors: [{message: "`restore` is not allowed to use inside `{{TEST}}`.", type: "Literal"}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{TEST}}('12345', function () {" +
          "sinon.stub();" +
        "});" +
      "});",
    errors: [{message: "`stub` is not allowed to use inside `{{TEST}}`.", type: "Identifier"}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{TEST}}('12345', function () {" +
          "sinon['stub']();" +
        "});" +
      "});",
    errors: [{message: "`stub` is not allowed to use inside `{{TEST}}`.", type: "Literal"}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{TEST}}('12345', function () {" +
          "sinon.spy();" +
        "});" +
      "});",
    errors: [{message: "`spy` is not allowed to use inside `{{TEST}}`.", type: "Identifier"}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () {" +
        "{{TEST}}('12345', function () {" +
          "sinon['spy']();" +
        "});" +
      "});",
    errors: [{message: "`spy` is not allowed to use inside `{{TEST}}`.", type: "Literal"}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () { " +
        "[].forEach(function () {" +
          "{{TEST}}('12345', function () {" +
            "sinon.spy();" +
          "});" +
        "});" +
      "});",
    errors: [{message: "`spy` is not allowed to use inside `{{TEST}}`.", type: "Identifier"}]
  },
  {
    code:
      "{{SUITESKIP}}('1234', function () { " +
        "[].forEach(function () {" +
          "{{TEST}}('12345', function () {" +
            "sinon['spy']();" +
          "});" +
        "});" +
      "});",
    errors: [{message: "`spy` is not allowed to use inside `{{TEST}}`.", type: "Literal"}]
  },
  {
    code:
      "{{TESTSKIP}}('12345', function () {" +
        "sinon.stub().withArgs().returns();" +
      "});",
    errors: [{message: "`stub` is not allowed to use inside `{{TESTSKIP}}`.", type: "Identifier"}]
  },
  {
    code:
      "{{TESTSKIP}}('12345', function () {" +
        "sinon['stub']().withArgs().returns();" +
      "});",
    errors: [{message: "`stub` is not allowed to use inside `{{TESTSKIP}}`.", type: "Literal"}]
  }
];

var validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(['code'], testHelpers.mochaDatasets)
  .uniqueCombos()
  .getCombos();

j.clearTemplates().clearCombos();
var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(['code', 'errors.@each.message'], testHelpers.mochaDatasets)
  .uniqueCombos()
  .getCombos();

ruleTester.run("disallow-stub-spy-restore-in-it", rule, {
  valid: validTests,
  invalid: invalidTests
});