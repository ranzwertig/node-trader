Indicator = require '../indicator.js'

class PeRatioIndicator extends Indicator

    constructor: (@equity, @index) ->

    calculate: =>
        val = @equity.latestFacts.peRatio
        if val == null
            return new Error

        if val < 12
            return 1
        if val > 16
            return -1
        return 0

module.exports = PeRatioIndicator