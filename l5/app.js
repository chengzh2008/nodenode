'use strict';
var async = require('async');

var concurrencyCount = 0;
var fetchUrl = function(url, callback) {
  // set a ramdom delay number 2000 miliseconds
  var delay = parseInt((Math.random() * 10000000) % 2000, 10);
  concurrencyCount++;
  console.log('Now the concurrent request number is: ' + concurrencyCount, ', now scraping ' + url + ', takes ' + delay + ' miliseconds');
  setTimeout(function(){
    concurrencyCount--;
    callback(null, url + ' html content');
  }, delay);
};

var urls = [];
for(var i = 0; i < 30; i++) {
  urls.push('http://example_' +i);
}

var maxConcurrentRequest = 10;
async.mapLimit(urls, maxConcurrentRequest, function(url, callback){
  fetchUrl(url, callback);
}, function(err, result){
  console.log('final:');
  console.log(result);
});
