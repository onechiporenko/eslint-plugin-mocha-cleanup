# eslint-plugin-mocha-cleanup

eslint-plugin-mocha-cleanup

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


## Usage

Add to your eslint config-file:

```javascript
"plugins": [
    "mocha-cleanup"
],
"rules": {
    "mocha-cleanup/asserts-limit": 2,
    "mocha-cleanup/disallow-stub-spy-restore-in-it": 2,
    "mocha-cleanup/no-empty-title": 2
}
```


