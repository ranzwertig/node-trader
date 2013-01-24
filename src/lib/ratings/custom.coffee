Rating = require '../rating.js'
Indicator = require '../indicator.js'
Endpoint = require '../endpoint.js'

###
Compute scores according custom pre defined indicators weightened by given weights

> trader -i jsonfile:dax.json -o table -r custom:DAX:ebitmargin,1:equityratio,1:pbratio,1:peratiomean,1:performance12m,1:performance6m,1:pricemomentum,1:prratio,1:returnofequity,1:threemonthreversal,1

###
class CustomRating extends Rating
    ###
    @param {String} indexName Name of the index used for perfomance comparison, uses search on finanzen.net to find the actual index
    @param {array} indicatorsAndWeightsArray everything after custom:INDEX: defining the indicators and weights, formated like e.g. custom:DAX:ReturnOfEquity,1:EbitMargin:2
    ###
    constructor: (@indexName, indicatorsAndWeightsArray...) ->
        @finanzennetEndpoint = Endpoint.create 'finanzennet'         

        @indicatorsAndWeights = {}
        for pair in indicatorsAndWeightsArray
            try
                [indicator, weight] = pair.split(',')
            catch err
                throw new Error('Invalid indicator and weight definition.')

            @indicatorsAndWeights[indicator] = weight

    ###
    Compute the rating for a list of equities.

    callback is called with Error|null and Object of the form:
    {
        [isin]: {
            score: Some float or integer, the higher the better
            certainty: 0-1 (a percentage) This value is equal to 1 if no value necessary for the rating process was missing. Therefore it gives the percentage of necessary equity facts which were available.
        }
        ...
    }
    ###
    getRating: (equities, cb) =>
        # we need to load the index first
        @finanzennetEndpoint.searchIndex @indexName, (err, index) =>
            if err
                cb err, null
                return

            # combine indicators
            ratings = {}
            for equity in equities
                totalScore = 0
                totalErrors = 0
                scores = []

                # calculate each score for the current equity
                for indicatorName of @indicatorsAndWeights
                    try
                        score = Indicator.create(indicatorName, equity, index).calculate()
                    catch err
                        cb(new Error('error calculating indicator ' + indicatorName), null)

                    if score instanceof Error
                        scores.push score
                    else
                        # multiply the score by weight and push to scores array
                        scores.push score * parseFloat(@indicatorsAndWeights[indicatorName])

                for score in scores
                    if score instanceof Error
                        totalErrors++
                    else
                        totalScore += score

                ratings[equity.isin] =
                    score: totalScore
                    certainty: (scores.length - totalErrors) / scores.length

            cb null, ratings
        @

module.exports = CustomRating
