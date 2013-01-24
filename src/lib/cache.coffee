fs = require('fs')
crypto = require('crypto')
path = require('path')

###
    Cache class to cache the endpoint results
###
class Cache 

    constructor: (@cacheDir = '/tmp/trader') ->
        if not fs.existsSync @cacheDir
            fs.mkdirSync(@cacheDir)


    get: (key, cb) =>
        key = key.toLowerCase()
        shaSum = crypto.createHash('sha1')
        shaSum.update(key)
        hash = shaSum.digest('hex')

        fs.readFile path.join(@cacheDir, hash), 'utf8', (err, data) =>
            if err
                cb(new Error('unable to read cache file ' + path.join(@cacheDir, hash)), null)
            else
                try
                    cacheObject = JSON.parse(data)
                catch e
                    cb(new Error('unable to parse cache data'), null)

                cb(null, cacheObject)
        @

    set: (key, value, cb) =>
        key = key.toLowerCase()
        shaSum = crypto.createHash('sha1')
        shaSum.update(key)
        hash = shaSum.digest('hex')

        cacheString = JSON.stringify(value)

        try
            #TODO: check why async version does not work here!!
            fs.writeFileSync path.join(@cacheDir, hash), new Buffer(cacheString)
        catch err
            cb(new Error('unable to store value to cache'))
            return @
        cb(null)
        @

module.exports = Cache