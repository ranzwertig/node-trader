Indicator = require '../indicator.js'

class PriceMomentumIndicator extends Indicator

    constructor: (@equity, @index) ->

    calculate: =>
        score12M = Indicator.create('performance12m', @equity, @index).calculate()
        score6M = Indicator.create('performance6m', @equity, @index).calculate()

        if score12M instanceof Error or score6M instanceof Error
            return new Error

        if score6M == 1 and score12M <= 0
            return 1
        if score6M == -1 and score12M >= 0
            return -1
        return 0

module.exports = PriceMomentumIndicator