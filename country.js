(function(){
  // define a class, struct, prototype (what have you)
  // this will represent a country
  // this 'Country' will act as a super-class of the
  // Currency class
  class Country{
    constructor(country_name, currency_name){
      this.country_name = country_name
      this.currency_name = currency_name
    }

    // set the population of the country
    setPopulation(population){
      this.population = population
    }

    // set the gdp of the country
    setGDP(gdp){
      this.gdp = gdp
    }
  }

  // exort the Country class as a module that can be 'required()' in other scripts
  module.exports.Country = function(country_name, currency_name){
    return new Country(country_name, currency_name)
  }
}())
