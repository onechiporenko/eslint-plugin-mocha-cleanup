var obj = require("./obj.js");

var combos = [
  {SUITESKIP: 'describe.skip', TESTSKIP: 'it.skip', SUITE: 'describe', TEST: 'it'},
  {SUITESKIP: 'xcontext', TESTSKIP: 'it.skip', SUITE: 'context', TEST: 'it'},
  {SUITESKIP: 'xcontext', TESTSKIP: 'xspecify', SUITE: 'context', TEST: 'specify'},
  {SUITESKIP: 'xdescribe', TESTSKIP: 'xit', SUITE: 'describe', TEST: 'it' },
  {SUITESKIP: 'xcontext', TESTSKIP: 'xit', SUITE: 'context', TEST: 'it' },
  {SUITESKIP: 'suite.skip', TESTSKIP: 'test.skip', SUITE: 'suite', TEST: 'test' }
];

function replaceAllIn(str, replacers) {
  Object.keys(replacers).forEach(function (key) {
    str= str.replace(new RegExp(key, 'g'), replacers[key]);
  });
  return str;
}

module.exports = {

  /**
   * Generate all possible combinations for provided `templates`
   * Use `combinations` if they are provided, otherwise `combos` are used
   *
   * @param {object[]} templates
   * @param {object[]} [combinations]
   * @returns {object[]}
   */
  getCombos: function (templates, combinations) {
    var toReturn = [];
    var stringifies = [];
    var _combos = arguments.length > 1 ? combinations : combos;
    templates.forEach(function (template) {
      _combos.forEach(function (combo) {
        var c = JSON.parse(JSON.stringify(template));
        c.code = replaceAllIn(c.code, combo);
        if (c.errors) {
          c.errors.forEach(function(error) {
            if (error.message) {
              error.message = replaceAllIn(error.message, combo);
            }
          });
        }
        if (c.options) {
          if (obj.get(c, "options.0.test") && combo.OPTIONS) {
            c.options[0].test = combo.OPTIONS;
          }
          if (obj.get(c, "options.0.hook") && combo.OPTIONS) {
            c.options[0].hook = combo.OPTIONS;
          }
        }

        // no duplicates
        var stringified = JSON.stringify(c);
        if (stringifies.indexOf(stringified) === -1) {
          toReturn.push(c);
          stringifies.push(stringified);
        }
      });
    });
    return toReturn;
  }

};