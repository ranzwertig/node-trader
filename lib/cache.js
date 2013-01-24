(function() {
  var Cache, crypto, fs, path,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  fs = require('fs');

  crypto = require('crypto');

  path = require('path');

  /*
      Cache class to cache the endpoint results
  */


  Cache = (function() {

    function Cache(cacheDir) {
      this.cacheDir = cacheDir != null ? cacheDir : '/tmp/trader';
      this.set = __bind(this.set, this);

      this.get = __bind(this.get, this);

      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir);
      }
    }

    Cache.prototype.get = function(key, cb) {
      var hash, shaSum,
        _this = this;
      key = key.toLowerCase();
      shaSum = crypto.createHash('sha1');
      shaSum.update(key);
      hash = shaSum.digest('hex');
      fs.readFile(path.join(this.cacheDir, hash), 'utf8', function(err, data) {
        var cacheObject;
        if (err) {
          return cb(new Error('unable to read cache file ' + path.join(_this.cacheDir, hash)), null);
        } else {
          try {
            cacheObject = JSON.parse(data);
          } catch (e) {
            cb(new Error('unable to parse cache data'), null);
          }
          return cb(null, cacheObject);
        }
      });
      return this;
    };

    Cache.prototype.set = function(key, value, cb) {
      var cacheString, hash, shaSum;
      key = key.toLowerCase();
      shaSum = crypto.createHash('sha1');
      shaSum.update(key);
      hash = shaSum.digest('hex');
      cacheString = JSON.stringify(value);
      try {
        fs.writeFileSync(path.join(this.cacheDir, hash), new Buffer(cacheString));
      } catch (err) {
        cb(new Error('unable to store value to cache'));
        return this;
      }
      cb(null);
      return this;
    };

    return Cache;

  })();

  module.exports = Cache;

}).call(this);
