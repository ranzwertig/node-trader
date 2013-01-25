#!/usr/bin/env node

(function() {
  var IndexImporter, ProgressBar, cache, importer, importerCb, list, makeTick, name, opts, output, program, rating, readline, rl, trader, _ref, _ref1, _ref2, _ref3, _ref4, _ref5,
    __slice = [].slice;

  trader = require('../lib/trader.js');

  ProgressBar = require('progress');

  program = require('commander');

  readline = require('readline');

  list = function(val) {
    return val.split(':');
  };

  program.version('0.1.0').option('-p, --progress', 'show a progress bar if possible (do not use progress if you want to pipe the output)').option('-i, --input <importer>', 'importer to use to fetch equities [dax]', list, list('dax')).option('-o, --output <format>', 'choose output format [table]', list, list('table')).option('-r, --rating <type>', 'choose rating system [none]', list, null).option('-c, --cache <action>', 'cache action, options: all, clear', null).option('-f, --cachefolder <cachefolder>', 'cache data to folder [/tmp/trader]', '/tmp/trader').option('-t, --cachetime <seconds>', 'cache time in seconds [86400]', parseInt, 86400).parse(process.argv);

  if (program.cache) {
    cache = trader.Cache.getInstance(true, program.cache, program.cachefolder, program.cachetime);
  } else {
    cache = trader.Cache.getInstance(false);
  }

  _ref = program.input, name = _ref[0], opts = 2 <= _ref.length ? __slice.call(_ref, 1) : [];

  importer = (_ref1 = trader.Importer).create.apply(_ref1, [name].concat(__slice.call(opts)));

  _ref2 = program.output, name = _ref2[0], opts = 2 <= _ref2.length ? __slice.call(_ref2, 1) : [];

  output = (_ref3 = trader.OutputFormatter).create.apply(_ref3, [name].concat(__slice.call(opts)));

  rating = null;

  if (program.rating) {
    _ref4 = program.rating, name = _ref4[0], opts = 2 <= _ref4.length ? __slice.call(_ref4, 1) : [];
    IndexImporter = require('../lib/importers/index.js');
    if (opts.length === 0 && name.toLowerCase() === 'levermann' && importer instanceof IndexImporter) {
      opts.push(importer.getIndexName());
    }
    try {
      rating = (_ref5 = trader.Rating).create.apply(_ref5, [name].concat(__slice.call(opts)));
    } catch (err) {
      process.stderr.write(err.message + '\n');
      process.exit(1);
    }
  }

  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt('', 0);

  makeTick = function(title) {
    var bar, lastProgress;
    bar = null;
    lastProgress = 0;
    return function(progress, total) {
      if (!bar) {
        bar = new ProgressBar(title + ' [:bar] :percent', {
          total: total,
          width: 20,
          complete: '=',
          incomplete: ' '
        });
      }
      bar.tick(progress - lastProgress);
      lastProgress = progress;
      if (progress === total) {
        return rl.write(null, {
          ctrl: true,
          name: 'u'
        });
      }
    };
  };

  importerCb = function(err, equities) {
    var ratingCb;
    if (err) {
      process.stderr.write(err.message + '\n');
      process.exit(1);
    }
    if (!rating) {
      process.stdout.write(output.equitiesToString(equities));
      process.exit(0);
    }
    ratingCb = function(err, ratings) {
      var e, _i, _len;
      if (err) {
        process.stderr.write(err.message + '\n');
        process.exit(1);
      }
      for (_i = 0, _len = equities.length; _i < _len; _i++) {
        e = equities[_i];
        e.rating = ratings[e.isin];
      }
      equities.sort(function(a, b) {
        if (a.rating.score === b.rating.score) {
          return b.rating.certainty - a.rating.certainty;
        }
        return b.rating.score - a.rating.score;
      });
      if (program.progress) {
        rl.write(null, {
          ctrl: true,
          name: 'u'
        });
      }
      process.stdout.write(output.equitiesToString(equities));
      return process.exit(0);
    };
    if (program.progress) {
      rl.write('Rating equities...');
    }
    return rating.getRating(equities, ratingCb);
  };

  importer.getEquities(importerCb, (program.progress ? makeTick('Importing equities:\t') : void 0));

}).call(this);
