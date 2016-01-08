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

* `asserts-limit` Rule to disallow use more than allowed number of assertions. `it`s without any assertions are also disallowed. Rule may be customized with setting maximum number of allowed asserts:

```
"rules": {
    "mocha-cleanup/asserts-limit": [2, 3]
}
```

* `disallow-stub-spy-restore-in-it` Rule to disallow usage `stub/spy/restore` in the `it`

* `no-empty-title` Rule to disallow use empty title in the `describe` and `it`

* `no-same-titles` Rule to disallow usage same titles for `it`s inside one `describe`

* `no-nested-it` Rule to disallow usage nested `it`

* `no-assertions-outside-it` Rule to disallow use assertions outside `it`

* `complexity-it` Counts `it`-body complexity. May be customized with setting maximum complexity:

```
"rules": {
    "mocha-cleanup/complexity-it": [2, 30]
}
```

Each rule may be customized to avoid `describe.skip` and `it.skip` buy adding `true` to the and of the rule-settings. 

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
    "mocha-cleanup/complexity-it": 2
}
```


