var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');

var app = express();

app.get('/', function(req, res, next){
  superagent.get('https://cnodejs.org')
    .end(function(err, sres){
      if(err) return next(err);

      // here sres.text is the html content of the source 'cnodejs.org'
      // input it into the cheerio.load. cheerio works like a jquery.
      var $ = cheerio.load(sres.text);
      var items = [];
      $('#topic_list .topic_title').each(function(index, element){

        var $element = $(element);
        var item = {
          title: $element.attr('title'),
          href: $element.attr('href')
        };
        console.log(item)
        items.push(item);
      });
    res.send(items);

    });
});

app.listen(3000, function(){
  console.log('app is running at port 3000');
})
