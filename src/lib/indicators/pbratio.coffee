Indicator = require '../indicator.js'

class PbRatioIndicator extends Indicator

    constructor: (@equity, @index) ->

    calculate: =>
        val = @equity.latestFacts.pbRatio
        if val == null
            return new Error

        if val < 0.6
            return 2
        if val < 0.9
            return 1
        if val < 1.3
            return 0
        return -1

module.exports = PbRatioIndicator