Indicator = require '../indicator.js'

class PeRatioMeanIndicator extends Indicator

    constructor: (@equity, @index) ->

    calculate: =>
        # the mean of the last 5 years
        numYears = 5

        val = 0
        if @equity.latestFacts.peRatio == null
            return new Error
        else
            val += @equity.latestFacts.peRatio

        if not @equity.historicFacts or @equity.historicFacts.length < numYears-1
            return new Error

        for facts, i in @equity.historicFacts
            if i == numYears-1
                break
            if facts.peRatio == null
                return new Error
            val += facts.peRatio

        val /= numYears

        if val < 12
            return 1
        if val > 16
            return -1
        return 0

module.exports = PeRatioMeanIndicator