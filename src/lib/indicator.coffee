###
    Abstract equity indicator returning 1,0,-1 depending on equity and index
###
class Indicator 

    ###
        @param {object} equity
        @param {object} index
    ###
    constructor: (@equity, @index) ->

    ###
        returns 1,0,-1 based on equity and index or a Error on error
    ###
    calculate: () =>
        return new Error

    ###
    Static factory method
    ###
    @create: (name, args...) ->
        c = require './indicators/' + name.toLowerCase() + '.js'
        return new c(args...)

module.exports = Indicator