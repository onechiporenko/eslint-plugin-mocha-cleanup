var hasOwnProperty = Object.prototype.hasOwnProperty

var obj = require("./obj.js")

exports.isSkipSkipped = function (options, context) {
  return hasOwnProperty.call(options, "skipSkipped")
    ? options.skipSkipped
    : obj.get(context, "settings.mocha-cleanup.skipSkipped") || false
}
