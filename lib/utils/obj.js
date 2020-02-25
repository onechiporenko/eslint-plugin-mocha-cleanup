"use strict";

var _typesMap = {
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
};

module.exports = {

  get: function (obj, path) {
    var subpathes = path.split(".");
    while (subpathes.length) {
      var subpath = subpathes.shift();
      obj = obj[subpath];
      if (!obj) {
        return obj;
      }
    }
    return obj;
  },

  has: function (obj, path) {
    var subpathes = path.split(".");
    while (subpathes.length) {
      var subpath = subpathes.shift();
      obj = obj[subpath];
      if (!obj) {
        return false;
      }
    }
    return true;
  },

  getType: function (value) {
    return _typesMap[{}.toString.call(value)] || "object";
  }

};
