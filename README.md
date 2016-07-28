# eslint-plugin-mocha-cleanup

[![Build Status](https://travis-ci.org/onechiporenko/eslint-plugin-mocha-cleanup.svg)](https://travis-ci.org/onechiporenko/eslint-plugin-mocha-cleanup)
[![npm version](https://badge.fury.io/js/eslint-plugin-mocha-cleanup.png)](http://badge.fury.io/js/eslint-plugin-mocha-cleanup)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)
[![Downloads](http://img.shields.io/npm/dm/eslint-plugin-mocha-cleanup.svg)](https://www.npmjs.com/package/eslint-plugin-mocha-cleanup)

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-mocha-cleanup`:

```
$ npm install eslint-plugin-mocha-cleanup --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-mocha-cleanup` globally.

## Supported Rules

Almost each rule (unless otherwise indicated) may be customized to ignore skipped tests/suites (`describe.skip`, `it.skip`, `xspecify` etc) with adding `skipSkipped: true` to the rule-options. 

* `asserts-limit` Rule to disallow use more than allowed number of assertions. Tests without any assertions are also disallowed. Rule may be customized with setting maximum number of allowed asserts:

```
"rules": {
    "mocha-cleanup/asserts-limit": [2, {"assertsLimit": 3}]
}
```

This rule ignores tests with `done`-callback and 0 assertions. Set option `ignoreZeroAssertionsIfDoneExists` to `false` to allow such behavior:

```
"rules": {
    "mocha-cleanup/asserts-limit": [2, {"ignoreZeroAssertionsIfDoneExists": false}]
}
```

* `disallow-stub-spy-restore-in-it` Rule to disallow `stub/spy/restore` in the tests (should be in the hooks)

* `no-empty-title` Rule to disallow empty title in the suites and tests

* `no-same-titles` Rule to disallow same titles for tests inside one suite or in the whole file. It depends on `scope` value - may be `file` or `suite`. Default - `suite`

```
"rules": {
    "mocha-cleanup/no-same-titles": [2, {scope: "file"}]
}
```

* `no-nested-it` Rule to disallow nested tests (not suites)

* `no-assertions-outside-it` Rule to disallow assertions outside tests

* `complexity-it` Counts test-body complexity. May be customized with setting maximum complexity:

```
"rules": {
    "mocha-cleanup/complexity-it": [2, {"maxAllowedComplexity": 30}]
}
```

* `no-eql-primitives` Rule to disallow `eql`, `deep.equal`, `assert.deepEqual`, `assert.notDeepEqual` with primitives

* `no-assertions-in-loop` Rule to disallow assertions inside loops. Rule may be customized with setting additional loops like `forEach`:

```
"rules": {
    "mocha-cleanup/no-assertions-in-loop": [2, {"extraMemberExpression": ["forEach"]}]
}
```

* `no-empty-body` Rule to disallow empty tests, suites and hooks

* `invalid-assetions` Rule to check `expect` and `should` assertions for completeness. It detects assertions that end with "chainable" words or even raw calls for `expect` and `should`

* `no-expressions-in-assertions` Rule to detect expressions in the `expect` and `assert` assertions

* `disallowed-usage` Rule to disallow usage some functions, methods or properties in the tests and hooks

```
"rules": {
    "mocha-cleanup/disallowed-usage": [
        2, 
        {
            "test": [{"o": "myObject", "m": ["myNotAllowedMethod"]}], 
            "hook": [{"f": "myNotAllowedFunction"}, {"o": "myObject", "p": ["myNotAllowedProperty"]}]
        }
    ]
}
```

* `disallow-stub-window` Rule to disallow stubbing some `window`-methods. **IMPORTANT** This rule doesn't have `skipSkipped` option 

* `no-outside-declaration` Rule to disallow variables declaration outside tests and hooks

## Usage

Add to your eslint config-file:

```javascript
"plugins": [
    "mocha-cleanup"
],
"rules": {
    "mocha-cleanup/asserts-limit": 2,
    "mocha-cleanup/disallow-stub-spy-restore-in-it": 2,
    "mocha-cleanup/no-empty-title": 2,
    "mocha-cleanup/no-same-titles": 2,
    "mocha-cleanup/no-nested-it": 2,
    "mocha-cleanup/no-assertions-outside-it": 2,
    "mocha-cleanup/complexity-it": 2,
    "mocha-cleanup/no-eql-primitives": 2,
    "mocha-cleanup/no-assertions-in-loop": 2,
    "mocha-cleanup/no-empty-body": 2,
    "mocha-cleanup/invalid-assertions": 2,
    "mocha-cleanup/no-expressions-in-assertions": 2,
    "mocha-cleanup/disallowed-usage": [
        2, 
        {
            "test": [{"o": "myObject", "m": ["myNotAllowedMethod"]}], 
            "hook": [{"f": "myNotAllowedFunction"}, {"o": "myObject", "p": ["myNotAllowedProperty"]}]
        }
    ],
    "mocha-cleanup/disallow-stub-window": [
        2,
        {
            "methods": ["setTimeout"]
        }
    ],
    "mocha-cleanup/no-outside-declaration": 2
}
```
