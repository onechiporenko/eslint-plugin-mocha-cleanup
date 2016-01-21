"use strict";

var rule = require("../../../lib/rules/disallowed-usage"),
  RuleTester = require("eslint").RuleTester;
var testHelpers = require("../../../lib/utils/tests.js");

var ruleTester = new RuleTester();

var disallowed = [
  {CODE: "obj.subObj.prop = 1;", MESSAGE: "obj.subObj.prop", OPTIONS: [{o: "obj.subObj", p: "prop"}]},
  {CODE: "obj.prop = '1';", MESSAGE: "obj.prop", OPTIONS: [{o: "obj", p: "prop"}]},
  {CODE: "expect(obj.property).to.be.equal('1');", MESSAGE: "obj.property", OPTIONS: [{o: "obj", p: "property"}]},
  {CODE: "obj.subObj.method(1, 2);", MESSAGE: "obj.subObj.method", OPTIONS: [{o: "obj.subObj", m: "method"}]},
  {CODE: "obj.method('1');", MESSAGE: "obj.method", OPTIONS: [{o: "obj", m: "method"}]},
  {CODE: "method();", MESSAGE: "method", OPTIONS: [{f: "method"}]}
];

var hooks = [
  {HOOK: "before"},
  {HOOK: "beforeEach"},
  {HOOK: "after"},
  {HOOK: "afterEach"}
];

var validTestTemplates = [
  {
    code:
      "SUITESKIP('1234', function () {" +
        "TEST('4321', function () {" +
          "CODE;" +
        "})" +
      "})",
    options: [
      {
        skipSkipped: true,
        test: true
      }
    ]
  },
  {
    code:
      "SUITESKIP('1234', function () {" +
        "HOOK(function () {" +
          "CODE;" +
        "})" +
      "})",
    options: [
      {
        skipSkipped: true,
        test: true
      }
    ]
  },
  {
    code:
      "SUITE('1234', function () {" +
        "TESTSKIP('4321', function () {" +
          "CODE;" +
        "})" +
      "})",
    options: [
      {
        skipSkipped: true,
        test: true
      }
    ]
  }
];
var invalidTestTemplates = [
  {
    code:
      "SUITE('1234', function () {" +
        "TEST('4321', function () {" +
          "CODE;" +
        "})" +
      "})",
    options: [
      {
        test: true
      }
    ],
    errors: [
      {message: "`MESSAGE` is not allowed here."}
    ]
  },
  {
    code:
      "SUITE('1234', function () {" +
        "HOOK('4321', function () {" +
          "CODE;" +
        "})" +
      "})",
    options: [
      {
        hook: true
      }
    ],
    errors: [
      {message: "`MESSAGE` is not allowed here."}
    ]
  },
  {
    code:
      "SUITE('1234', function () {" +
        "TEST('4321', function () {" +
          "CODE" +
          "CODE" +
          "CODE" +
        "})" +
      "})",
    options: [
      {
        test: true
      }
    ],
    errors: [
      {message: "`MESSAGE` is not allowed here."},
      {message: "`MESSAGE` is not allowed here."},
      {message: "`MESSAGE` is not allowed here."}
    ]
  },
  {
    code:
      "SUITE('1234', function () {" +
        "HOOK('4321', function () {" +
          "CODE" +
          "CODE" +
          "CODE" +
        "})" +
      "})",
    options: [
      {
        hook: true
      }
    ],
    errors: [
      {message: "`MESSAGE` is not allowed here."},
      {message: "`MESSAGE` is not allowed here."},
      {message: "`MESSAGE` is not allowed here."}
    ]
  },
  {
    code:
      "SUITE('1234', function () {" +
        "HOOK('4321', function () {" +
          "CODE" +
        "});" +
        "TEST('4321', function () {" +
          "CODE" +
        "});" +
      "});",
    options: [
      {
        hook: true,
        test: true
      }
    ],
    errors: [
      {message: "`MESSAGE` is not allowed here."},
      {message: "`MESSAGE` is not allowed here."}
    ]
  }
];

var valid = testHelpers.getCombos(testHelpers.getCombos(testHelpers.getCombos(validTestTemplates, hooks), disallowed));
var invalid = testHelpers.getCombos(testHelpers.getCombos(testHelpers.getCombos(invalidTestTemplates, hooks), disallowed));

ruleTester.run("disallowed-usage", rule, {
  valid: valid,
  invalid: invalid
});