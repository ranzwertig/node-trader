Indicator = require '../indicator.js'

class TreeMonthReversalIndicator extends Indicator

    constructor: (@equity, @index) ->

    calculate: =>
        if not Indicator.create('isLargeCap', @equity, @index).calculate()
            return 0

        if not @equity.monthlyPrices or @equity.monthlyPrices.length < numMonths+1
            return new Error

        if not @index.monthlyPrices or @index.monthlyPrices.length < numMonths+1
            return new Error

        # the number of month to compare the performance of the index to the equity
        numMonths = 3
        more = 0
        less = 0

        for i in [0..(numMonths-1)]
            equityPerformance = @equity.monthlyPrices[i] / @equity.monthlyPrices[i+1]
            indexPerformance = @index.monthlyPrices[i] / @index.monthlyPrices[i+1]

            if equityPerformance < indexPerformance
                less++
            else if equityPerformance > indexPerformance
                more++

        if less == numMonths
            return 1
        if more == numMonths
            return -1
        return 0

module.exports = TreeMonthReversalIndicator
        