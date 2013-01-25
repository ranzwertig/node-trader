(function() {
  var Cache, crypto, fs, path, root, _Cache,
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  fs = require('fs');

  crypto = require('crypto');

  path = require('path');

  /*
      Cache class to cache the endpoint results
  */


  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  Cache = (function() {
    var _instance;

    function Cache() {}

    _instance = void 0;

    Cache.getInstance = function() {
      var opts;
      opts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _instance != null ? _instance : _instance = (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args), t = typeof result;
        return t == "object" || t == "function" ? result || child : child;
      })(_Cache, opts, function(){});
    };

    return Cache;

  })();

  _Cache = (function() {

    function _Cache(enabled, action, cacheDir, cacheTime) {
      this.enabled = enabled != null ? enabled : false;
      this.action = action != null ? action : 'all';
      this.cacheDir = cacheDir != null ? cacheDir : '/tmp/trader';
      this.cacheTime = cacheTime != null ? cacheTime : 86400;
      this.set = __bind(this.set, this);

      this.get = __bind(this.get, this);

      if (this.enabled) {
        if (this.action === 'clear') {
          this._clear(this.cacheDir);
        }
        if (!fs.existsSync(this.cacheDir)) {
          fs.mkdirSync(this.cacheDir);
        }
      }
    }

    _Cache.prototype._clear = function(path) {
      var _this = this;
      if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index) {
          var curPath;
          curPath = path + "/" + file;
          if (fs.statSync(curPath).isDirectory()) {
            return deleteFolderRecursive(curPath);
          } else {
            return fs.unlinkSync(curPath);
          }
        });
      }
      return fs.rmdirSync(path);
    };

    _Cache.prototype.get = function(key) {
      var cacheObject, data, hash, shaSum, stats;
      if (!this.enabled) {
        return null;
      }
      key = key.toLowerCase();
      shaSum = crypto.createHash('sha1');
      shaSum.update(key);
      hash = shaSum.digest('hex');
      try {
        stats = fs.statSync(path.join(this.cacheDir, hash));
        if ((Math.floor(new Date().getTime() / 1000) - Math.floor(stats.mtime.getTime() / 1000)) > this.cacheTime) {
          fs.unlinkSync(path.join(this.cacheDir, hash));
          return null;
        }
        data = fs.readFileSync(path.join(this.cacheDir, hash), 'utf8');
      } catch (err) {
        return null;
      }
      try {
        cacheObject = JSON.parse(data);
      } catch (e) {
        throw new Error('unable to parse cache data');
      }
      return cacheObject;
    };

    _Cache.prototype.set = function(key, value, cb) {
      var cacheString, hash, shaSum;
      if (!this.enabled) {
        return this;
      }
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

    return _Cache;

  })();

  module.exports = Cache;

}).call(this);
