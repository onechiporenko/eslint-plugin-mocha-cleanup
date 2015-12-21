module.exports = {

  get: function (obj, path) {
    var subpathes = path.split('.');
    while (subpathes.length) {
      var subpath = subpathes.shift();
      obj = obj[subpath];
      if (!obj) {
        return obj;
      }
    }
    return obj;
  }

};