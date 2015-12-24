# eslint-plugin-mocha-cleanup

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

* `asserts-limit` Rule to disallow use more than allowed number of assertions

* `disallow-stub-spy-restore-in-it` Rule to disallow usage `stub/spy/restore` in the `it`

* `no-empty-title` Rule to disallow use empty title in the `describe` and `it`

* `no-same-titles` Rule to disallow usage same titles for `it`s inside one `describe`

* `no-nested-it` Rule to disallow usage nested `it`


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
    "mocha-cleanup/no-nested-it": 2
}
```


