Indicator = require '../indicator.js'

class Performance6MIndicator extends Indicator

    constructor: (@equity, @index) ->

    calculate: =>
        if not @equity.latestPrice or not @equity.monthlyPrices or @equity.monthlyPrices.length < 6
            return new Error

        ratio =  @equity.latestPrice / @equity.monthlyPrices[5]

        if ratio > 1.05
            return 1
        if ratio < 0.95
            return -1
        return 0

module.exports = Performance6MIndicator