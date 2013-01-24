Indicator = require '../indicator.js'

class EbitMarginIndicator extends Indicator

    constructor: (@equity, @index) ->

    calculate: =>
        val = @equity.latestFacts.ebitMargin
        if val == null
            return new Error

        if val > 12
            return 1
        if val < 6
            return -1
        return 0

module.exports = EbitMarginIndicator