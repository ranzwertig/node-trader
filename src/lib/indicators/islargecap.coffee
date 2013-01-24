Indicator = require '../indicator.js'

class IsLargeCapIndicator extends Indicator

    constructor: (@equity, @index) ->

    calculate: =>
        if @equity.latestFacts.marketCap == null
            return false

        # market cap needs to be in Euro
        @equity.latestFacts.marketCap > (5 * Math.pow(10, 9))

module.exports = IsLargeCapIndicator        