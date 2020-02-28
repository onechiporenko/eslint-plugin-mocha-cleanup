"use strict"

const _typesMap = {
  "[object Boolean]": "boolean",
  "[object Number]": "number",
  "[object String]": "string",
  "[object Function]": "function",
  "[object Array]": "array",
  "[object Date]": "date",
  "[object RegExp]": "regexp",
  "[object Object]": "object",
  "[object Undefined]": "undefined",
  "[object Null]": "null"
}

module.exports = {

  get (obj, path) {
    const subpathes = path.split(".")
    while (subpathes.length) {
      const subpath = subpathes.shift()
      obj = obj[subpath]
      if (!obj) {
        return obj
      }
    }
    return obj
  },

  has (obj, path) {
    const subpathes = path.split(".")
    while (subpathes.length) {
      const subpath = subpathes.shift()
      obj = obj[subpath]
      if (!obj) {
        return false
      }
    }
    return true
  },

  getType (value) {
    return _typesMap[{}.toString.call(value)] ||
      /* istanbul ignore next */
      "object"
  }

}
