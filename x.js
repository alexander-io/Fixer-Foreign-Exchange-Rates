// var $ = require('jquery')
var delta = require('./country.js')
var lambda = require('./currency.js')
// var delta = require('def')
var $ = require('./jq.js')
var fx = require('money')
var request = require('request')
var fs = require('fs')
// console.log('delta', delta)

var d = new Date()

var file_data = d

const update_interval_hours = 1
const update_interval_mili = update_interval_hours * 3600000

// console.log(delta.Country())
// var us = delta.Country('united states', 'USD')
var usd = lambda.Currency('USD', 'united states')
// console.log(us)
console.log(usd)
// console.log(us)
// console.log(us.name)

/*
This is a promise to write fixer.io currency exchange data out to a local file.

The Problem
  the asynchronous execution of js causes race conditions
  sending http requests to the remote fixer.io server takes time
  we need as much spare time as possible to create objects, do math, or power graphical models

Solution
  if we keep a record of the last request, it is not necessary to request data from remote server so frequently
  instead we can just read the data in from a local file

Methodology

  Before submitting a request to the fixer.io API (which may take
  several seconds for response) the promise will check if their is a "recent"
  enough version of the data available locally.

  If the local version has been updated 'recently' (determined by a time interval)
  then the function prefers not to request the fixer.io api. It instead resolves
  the data contained in the local file and calculates the remaining time until an
  update will be performed.

Manipulate the update interval (time between updates) by changing variables :
  const update_interval_hours
    &
  const update_interval_mili
*/
var check_file_expiration = new Promise(function(resolve, reject){
  // attempt to read the file
  fs.readFile('./etc/file.txt', 'utf8', (err, data) => {
    // if error occurs...
    if (err) {
      // ... check the type of error, if file is non-existent then make one
      if (err.errno == -2 && err.syscall == 'open') {
        console.log('no file exists... make one')

        // build the string that will be used to update the file
        let update_string = d.getTime().toString() + '\n'

        // go get the fixer data,
        getFixerData.then(function(result){
          // if fixer request succeeded, the fixer data will come in through 'result'
          // append the fixer data to the update_string
          update_string += result
          // make the file and write the current time and fixer data
          fs.writeFile('./etc/file.txt', update_string, (err) => {
            // if error writing, throw
            if (err) throw err;
            // otherwise it worked
            console.log('It\'s saved!');
          });
          resolve(data)
        })
      }
    } else { // else, error didn't occur...
      // ...file read works, check if it is time for an update :
      if (d.getTime() - update_interval_mili > parseInt(data)){
        // the time elapsed since the last update has surpassed the update_interval_period
        // so our file needs an update
        console.log('file needs update')
        // build string to write to file
        let update_string = d.getTime().toString() + '\n'
        // go get fixer data from api
        getFixerData.then(function(result){
          // append the fixer data string to the file write string-builder
          update_string += result
          fs.writeFile('./etc/file.txt', update_string, (err) => {
            if (err) throw err;
            console.log('It\'s saved!');
          });
          resolve(data)
        })
      } else { // else, it is not time for an update
        console.log('no update needed')
        // calculate the time remaining until update
        let seconds_remaining = parseInt(data) - (d.getTime()-update_interval_mili)
        console.log('next update needed in : ' + Number((seconds_remaining/1000)/60).toFixed(4) + ' minutes')
        resolve(data)
      }
    }
  });
})

check_file_expiration.then(function(result){
  file_data = result
  console.log('data : \n' + file_data)
})




var fxrData


// var unitedStates = new delta.Country()

var bitCoinData
var getFixerData = new Promise(function(resolve, reject){

  request('http://api.fixer.io/latest?base=USD', function(error, response, json){
    if (!error && response.statusCode == 200){
      resolve(json)
    }
  })
})

var getBitCoinData = new Promise(function(resolve, reject){
  // request('https://blockchain.info/tobtc?currency=USD&value=500', function(error, response, json){
  request('https://blockchain.info/ticker', function(error, response, json){
    if (!error && response.statusCode == 200){
      resolve(json)
    }
  })
})

// call getFixerData
// getFixerData.then(function(result){
//   // convert the string to JSON format
//   fxrData = JSON.parse(result)
//   console.log(fxrData.rates)
//
//   // var usdNotes = [1, 5, 10, 20, 50, 100]
//   // var unitedStatesDollar = new Currency('USD', 'United States', usdNotes)
//   // var japaneseYen = new Currency('JPY', 'Japan')
//   // unitedStatesDollar.compareCurrencyTo(japaneseYen)
//   // var canadianDollar = new Currency('CAD', 'Canada')
//   // var greatBritishPound = new Currency('GBP', 'Britian')
//   // canadianDollar.compareCurrencyTo(greatBritishPound)
//   // greatBritishPound.compareCurrencyTo(canadianDollar)
//
//
//   // getBitCoinData.then(function(result){
//   //   bitCoinData = JSON.parse(result)
//   //   // console.log(bitCoinData)
//   // })
//
// })
