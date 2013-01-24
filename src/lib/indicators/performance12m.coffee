Indicator = require '../indicator.js'

class Performance12MIndicator extends Indicator

    constructor: (@equity, @index) ->

    calculate: =>
        if not @equity.latestPrice or not @equity.monthlyPrices or @equity.monthlyPrices.length < 12
            return new Error

        ratio =  @equity.latestPrice / @equity.monthlyPrices[11]

        if ratio > 1.05
            return 1
        if ratio < 0.95
            return -1
        return 0

module.exports = Performance12MIndicator
