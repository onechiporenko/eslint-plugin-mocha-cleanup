var _typesMap = {
  "[object Boolean]":  "boolean",
  "[object Number]":   "number",
  "[object String]":   "string",
  "[object Function]": "function",
  "[object Array]":    "array",
  "[object Date]":     "date",
  "[object RegExp]":   "regexp",
  "[object Object]":   "object"
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

  getType: function (value) {
    if (value === null) {
      return "null";
    }
    return _typesMap[{}.toString.call(value)] || "object";
  }

};