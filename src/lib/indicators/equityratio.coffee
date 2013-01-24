Indicator = require '../indicator.js'

class EquityRatioIndicator extends Indicator

    constructor: (@equity, @index) ->

    calculate: =>
        val = @equity.latestFacts.equityRatio
        if val == null
            return new Error

        if val > 25
            return 1
        if val < 15
            return -1
        return 0

module.exports = EquityRatioIndicator        