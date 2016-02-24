"use strict";

var rule = require("../../../lib/rules/no-expressions-in-assertions"),
  RuleTester = require("eslint").RuleTester;
var testHelpers = require("../../../lib/utils/tests.js");
var ruleTester = new RuleTester({env: {es6: true}});

var Jsonium = require('jsonium');
var j = new Jsonium();

var defaultMessage = "Expression should not be used here.";
var detailedMessage = "`{{USE}}` should be used.";
var emptyArgMessage = "Empty assertion is not allowed.";

var binariesForExpect = [
  {BINARY: ">", USE: ".to.be.above"},
  {BINARY: "<", USE: ".to.be.below"},
  {BINARY: ">=", USE: ".to.be.at.least"},
  {BINARY: "<=", USE: ".to.be.most"},
  {BINARY: "==", USE: ".to.be.equal"},
  {BINARY: "===", USE: ".to.be.equal"},
  {BINARY: "!=", USE: ".to.be.not.equal"},
  {BINARY: "!==", USE: ".to.be.not.equal"},
  {BINARY: "instanceof", USE: ".to.be.instanceof"}
];

var binariesForAssert = [
  {BINARY: ">", USE: ".isAbove"},
  {BINARY: "<", USE: ".isBelow"},
  {BINARY: ">=", USE: ".isAtLeast"},
  {BINARY: "<=", USE: ".isAtMost"},
  {BINARY: "==", USE: ".equal"},
  {BINARY: "===", USE: ".strictEqual"},
  {BINARY: "!=", USE: ".notEqual"},
  {BINARY: "!==", USE: ".notStrictEqual"}
];

var logical = [
  {LOGICAL: "+"},
  {LOGICAL: "-"},
  {LOGICAL: "/"},
  {LOGICAL: "*"},
  {LOGICAL: "%"},
  {LOGICAL: "^"},
  {LOGICAL: "&&"},
  {LOGICAL: "||"}
];

var updates = [
  {UPDATE: "++"},
  {UPDATE: "--"}
];

var unaries = [
  {UNARY: "!"},
  {UNARY: "~"},
  {UNARY: "+"},
  {UNARY: "-"}
];

var primitiveEqualitiesForExpect = [
  {EQL_BINARY: "==", NOT: ""},
  {EQL_BINARY: "===", NOT: ""},
  {EQL_BINARY: "!=", NOT: "not."},
  {EQL_BINARY: "!==", NOT: "not."}
];

var primitiveEqualitiesForAssert = [
  {EQL_BINARY: "==", NOT: ""},
  {EQL_BINARY: "===", NOT: ""},
  {EQL_BINARY: "!=", NOT: "Not"},
  {EQL_BINARY: "!==", NOT: "Not"}
];

var primitiveValuesForExpect = [
  {VAL: "null", EQL_BINARY: "{{EQL_BINARY}}", USE: ".to.{{NOT}}be.null"},
  {VAL: "true", EQL_BINARY: "{{EQL_BINARY}}", USE: ".to.{{NOT}}be.true"},
  {VAL: "false", EQL_BINARY: "{{EQL_BINARY}}", USE: ".to.{{NOT}}be.false"},
  {VAL: "undefined", EQL_BINARY: "{{EQL_BINARY}}", USE: ".to.{{NOT}}be.undefined"}
];

var primitiveValuesForAssert = [
  {VAL: "null", EQL_BINARY: "{{EQL_BINARY}}", USE: ".is{{NOT}}Null"},
  {VAL: "true", EQL_BINARY: "{{EQL_BINARY}}", USE: ".is{{NOT}}True"},
  {VAL: "false", EQL_BINARY: "{{EQL_BINARY}}", USE: ".is{{NOT}}False"}
];

var primitiveAssertions = [
  {ASSERTION: "a {{EQL_BINARY}} {{VAL}}", MESSAGE: detailedMessage},
  {ASSERTION: "a {{EQL_BINARY}} {{VAL}}", MESSAGE: detailedMessage},
  {ASSERTION: "{{VAL}} {{EQL_BINARY}} b", MESSAGE: detailedMessage},
  {ASSERTION: "{{VAL}} {{EQL_BINARY}} b", MESSAGE: detailedMessage}
];

var primitiveAssertionsForExpect = j
  .setTemplates(primitiveAssertions)
  .createCombos(["ASSERTION", "MESSAGE"], primitiveValuesForExpect)
  .useCombosAsTemplates()
  .createCombos(["ASSERTION", "MESSAGE"], primitiveEqualitiesForExpect)
  .uniqueCombos()
  .getCombos();

var primitiveAssertionsForAssert = j
  .setTemplates(primitiveAssertions)
  .createCombos(["ASSERTION", "MESSAGE"], primitiveValuesForAssert)
  .useCombosAsTemplates()
  .createCombos(["ASSERTION", "MESSAGE"], primitiveEqualitiesForAssert)
  .uniqueCombos()
  .getCombos();

var assertions = [
  {ASSERTION: "a {{BINARY}} b", MESSAGE: detailedMessage},
  {ASSERTION: "a {{LOGICAL}} b", MESSAGE: defaultMessage},
  {ASSERTION: "{{UPDATE}} b", MESSAGE: defaultMessage},
  {ASSERTION: "b{{UPDATE}}", MESSAGE: defaultMessage},
  {ASSERTION: "{{UNARY}} a", MESSAGE: defaultMessage},
  {ASSERTION: "", MESSAGE: emptyArgMessage}
];

var assertionsForExpect = j
  .setTemplates(assertions)
  .createCombos(["ASSERTION", "MESSAGE"], binariesForExpect)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["ASSERTION"], logical)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["ASSERTION"], updates)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["ASSERTION"], unaries)
  .uniqueCombos()
  .concatCombos(primitiveAssertionsForExpect)
  .getCombos();

var assertionsForAssert = j
  .setTemplates(assertions)
  .createCombos(["ASSERTION", "MESSAGE"], binariesForAssert)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["ASSERTION"], logical)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["ASSERTION"], updates)
  .uniqueCombos()
  .useCombosAsTemplates()
  .createCombos(["ASSERTION"], unaries)
  .uniqueCombos()
  .concatCombos(primitiveAssertionsForAssert)
  .getCombos();


var validTestTemplatesForExpect = [
  {
    code:
      "expect({{ASSERTION}}).to.be.true;"
  },
  {
    code:
      "expect(typeof a).to.be.true;"
  },
  {
    code:
      "{{SUITE}}('123', {{ES}}" +
        "{{TESTSKIP}}('123', {{ES}}" +
          "expect({{ASSERTION}}).to.be.true;" +
        "});" +
      "});",
    options: [
      {skipSkipped: true}
    ]
  },
  {
    code:
      "{{SUITESKIP}}('123', {{ES}}" +
        "{{TEST}}('123', {{ES}}" +
          "expect({{ASSERTION}}).to.be.true;" +
        "});" +
      "});",
    options: [
      {skipSkipped: true}
    ]
  }

];

var validTestTemplatesForAssert = [
  {
    code:
      "assert.equal({{ASSERTION}});"
  },
  {
    code:
      "assert.equal(typeof a);"
  },
  {
    code:
    "{{SUITE}}('123', {{ES}}" +
      "{{TESTSKIP}}('123', {{ES}}" +
        "assert.equal({{ASSERTION}});" +
        "});" +
    "});",
    options: [
      {skipSkipped: true}
    ]
  },
  {
    code:
      "{{SUITESKIP}}('123', {{ES}}" +
        "{{TEST}}('123', {{ES}}" +
          "assert.equal({{ASSERTION}});" +
        "});" +
    "});",
    options: [
      {skipSkipped: true}
    ]
  },
  {
    code:
    "{{SUITE}}('123', {{ES}}" +
      "{{TESTSKIP}}('123', {{ES}}" +
        "assert({{ASSERTION}});" +
        "});" +
    "});",
    options: [
      {skipSkipped: true}
    ]
  },
  {
    code:
      "{{SUITESKIP}}('123', {{ES}}" +
        "{{TEST}}('123', {{ES}}" +
          "assert({{ASSERTION}});" +
        "});" +
    "});",
    options: [
      {skipSkipped: true}
    ]
  }
];

var invalidTestTemplatesForExpect = [
  {
    code:
      "{{SUITE}}('123', {{ES}}" +
        "{{TEST}}('123', {{ES}}" +
          "expect({{ASSERTION}}).to.be.true;" +
        "});" +
      "});",
    errors: [
      {message: "{{MESSAGE}}", type: "CallExpression"}
    ]
  }
];

var invalidTestTemplatesForAssert = [
  {
    code:
      "{{SUITE}}('123', {{ES}}" +
        "{{TEST}}('123', {{ES}}" +
          "assert.equal({{ASSERTION}});" +
        "});" +
      "});",
    errors: [
      {message: "{{MESSAGE}}", type: "MemberExpression"}
    ]
  },
  {
    code:
      "{{SUITE}}('123', {{ES}}" +
        "{{TEST}}('123', {{ES}}" +
          "assert({{ASSERTION}});" +
        "});" +
      "});",
    errors: [
      {message: "{{MESSAGE}}", type: "CallExpression"}
    ]
  }
];

var validTests = j
  .setTemplates(validTestTemplatesForExpect)
  .createCombos(["code"], assertionsForExpect)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .uniqueCombos()
  .getCombos();

validTests = j
  .setTemplates(validTestTemplatesForAssert)
  .createCombos(["code"], assertionsForAssert)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .uniqueCombos()
  .concatCombos(validTests)
  .getCombos();

var invalidTests = j
  .setTemplates(invalidTestTemplatesForExpect)
  .createCombos(["code", "errors.@each.message"], assertionsForExpect)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .uniqueCombos()
  .getCombos();

invalidTests = j
  .setTemplates(invalidTestTemplatesForAssert)
  .createCombos(["code", "errors.@each.message"], assertionsForAssert)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.mochaDatasets)
  .useCombosAsTemplates()
  .createCombos(["code"], testHelpers.es)
  .uniqueCombos()
  .concatCombos(invalidTests)
  .getCombos();

ruleTester.run("no-expressions-in-assertions", rule, {
  valid: validTests,
  invalid: invalidTests
});