# eslint-plugin-mocha-cleanup

[![Build Status](https://travis-ci.org/onechiporenko/eslint-plugin-mocha-cleanup.svg)](https://travis-ci.org/onechiporenko/eslint-plugin-mocha-cleanup)
[![Coverage Status](https://coveralls.io/repos/github/onechiporenko/eslint-plugin-mocha-cleanup/badge.svg?branch=master)](https://coveralls.io/github/onechiporenko/eslint-plugin-mocha-cleanup?branch=master)
[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fonechiporenko%2Feslint-plugin-mocha-cleanup%2Fmaster)](https://dashboard.stryker-mutator.io/reports/github.com/onechiporenko/eslint-plugin-mocha-cleanup/master)
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

Almost each rule (unless otherwise indicated) may be customized to ignore skipped tests/suites (`describe.skip`, `it.skip`, `xspecify`, etc.) by adding `skipSkipped: true` to the rule options. One can also set `"settings": {"mocha-cleanup": {"skipSkipped": true}}` to have skipping for all applicable rules by default.

* `asserts-limit` Rule to disallow use of more than an allowed number of assertions. Tests without any assertions are also disallowed. Rule may be customized with setting the maximum number of allowed asserts (Defaults to 3):

```json
"rules": {
    "mocha-cleanup/asserts-limit": [2, {"assertsLimit": 3}]
}
```

This rule ignores tests with a `done`-callback and 0 assertions. Set the option `ignoreZeroAssertionsIfDoneExists` to `false` to allow such behavior:

```json
"rules": {
    "mocha-cleanup/asserts-limit": [2, {"ignoreZeroAssertionsIfDoneExists": false}]
}
```

* `disallow-stub-spy-restore-in-it` Rule to disallow `stub/spy/restore` in tests (they should instead be in hooks)

* `no-empty-title` Rule to disallow empty titles in suites and tests

* `no-same-titles` Rule to disallow identical titles for tests inside of one suite or within the whole file. It depends on the `scope` value - may be `file` or `suite`. Defaults to `suite`

```json
"rules": {
    "mocha-cleanup/no-same-titles": [2, {"scope": "file"}]
}
```

* `no-nested-it` Rule to disallow nested tests (not suites)

* `no-assertions-outside-it` Rule to disallow assertions outside tests

* `complexity-it` Counts test-body complexity. May be customized with setting maximum complexity (Defaults to 40):

```json
"rules": {
    "mocha-cleanup/complexity-it": [2, {"maxAllowedComplexity": 30}]
}
```

* `no-eql-primitives` Rule to disallow `eql`, `deep.equal`, `assert.deepEqual`, `assert.notDeepEqual` with primitives

* `no-assertions-in-loop` Rule to disallow assertions inside loops. Rule may be customized with setting additional loops like `forEach`:

```json
"rules": {
    "mocha-cleanup/no-assertions-in-loop": [2, {"extraMemberExpression": ["forEach"]}]
}
```

* `no-empty-body` Rule to disallow empty tests, suites and hooks

* `invalid-assertions` Rule to check `expect` and `should` assertions for completeness. It detects assertions that end with "chainable" words or even raw calls for `expect` and `should`

* `no-expressions-in-assertions` Rule to detect expressions in `expect` and `assert` assertions

* `disallowed-usage` Rule to disallow usage of some functions, methods or properties in the tests and hooks

```json
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

* `disallow-stub-window` Rule to disallow stubbing some `window`-methods. **IMPORTANT** This rule doesn't have a `skipSkipped` option

* `no-outside-declaration` Rule to disallow variable declarations outside tests and hooks

* `top-level-assertions` Rule to check if some assertions are not on top of the test-block. Rule is a "next-level" for `no-assertions-in-loop`. 

## Usage

Add to your eslint config-file:

```json
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
    "mocha-cleanup/no-outside-declaration": 2,
    "mocha-cleanup/top-level-assertions": 1
}
```

Or, if you want the items exactly as above (not including `disallowed-usage`, `disallow-stub-window` and `top-level-assertions`), just add this:

```json
{
  "extends": ["plugin:mocha-cleanup/recommended"]
}
```

Or, if you want those items above, minus also the following limit-based rules:

- `asserts-limit`
- `complexity-it`

...just add this:


```json
{
  "extends": ["plugin:mocha-cleanup/recommended-no-limits"]
}
```
