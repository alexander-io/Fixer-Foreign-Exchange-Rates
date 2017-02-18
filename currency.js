(function(){
  var link = require('./country.js')
  class Currency extends link.Country{

    constructor(currency_name, country_name, array_of_notes){
      super(country_name, currency_name)
      this.notes = array_of_notes
    }

    getCurrencyName(){
      return this.currency_name
    }

    setNotes(array_of_notes){
      this.notes = array_of_notes
    }

    getNotes(){
      return this.notes
    }

    compareCurrencyTo(other_country){
      // compare the currency of two countries
      // assume that the base country is this.
      let other_currency_valuation
      // if this.currency_name is USD, no conversion needed : return raw value of foreign currency
      if (this.currency_name == 'USD'){
        other_currency_valuation = fxrData.rates[other_country.currency_name]
        console.log('one', this.currency_name, 'will buy you', other_currency_valuation, 'in', other_country.currency_name)
        return other_currency_valuation
      } else {
        other_currency_valuation = fxrData.rates[other_country.currency_name] / fxrData.rates[this.currency_name]
        console.log('one', this.currency_name, 'will buy you', other_currency_valuation, 'in', other_country.currency_name)
        return other_currency_valuation

      }
    }
  }

  // export the currency module
  module.exports.Currency = function(currency_name, country_name, array_of_notes){
    return new Currency(currency_name, country_name, array_of_notes)
  }


}());
