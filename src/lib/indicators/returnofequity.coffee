Indicator = require '../indicator.js'

class ReturnOfEquityIndicator extends Indicator

    constructor: (@equity, @index) ->

    calculate: =>
        val = @equity.latestFacts.returnOfEquity
        if val == null
            return new Error
        if val > 20
            return 1
        if val < 10
            return -1
        return 0

module.exports = ReturnOfEquityIndicator