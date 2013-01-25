fs = require('fs')
crypto = require('crypto')
path = require('path')

###
    Cache class to cache the endpoint results
###

root = exports ? this

class Cache

    _instance = undefined

    @getInstance: (opts...) ->
        _instance ?= new _Cache(opts...)

class _Cache 

    constructor: (@enabled = false, @action = 'all', @cacheDir = '/tmp/trader', @cacheTime = 86400) ->
        if @enabled
            if @action is 'clear'
                @_clear(@cacheDir)
                
            if not fs.existsSync @cacheDir
                fs.mkdirSync(@cacheDir)

    _clear: (path) ->
        if fs.existsSync path
            fs.readdirSync(path).forEach (file,index) =>
                curPath = path + "/" + file
                if fs.statSync(curPath).isDirectory()
                    deleteFolderRecursive(curPath)
                else
                    fs.unlinkSync(curPath)

        fs.rmdirSync(path)
  

    get: (key) =>
        if not @enabled
            return null

        key = key.toLowerCase()
        shaSum = crypto.createHash('sha1')
        shaSum.update(key)
        hash = shaSum.digest('hex')

        try
            stats = fs.statSync path.join(@cacheDir, hash)
            if (Math.floor(new Date().getTime() / 1000) - Math.floor(stats.mtime.getTime() / 1000)) > @cacheTime
                fs.unlinkSync(path.join(@cacheDir, hash))
                return null
            data = fs.readFileSync path.join(@cacheDir, hash), 'utf8'
        catch err
            return null
        
        try
            cacheObject = JSON.parse(data)
        catch e
            throw new Error('unable to parse cache data')
        cacheObject

    set: (key, value, cb) =>
        if not @enabled
            return @

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