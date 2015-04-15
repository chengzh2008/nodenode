var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var url = require('url');

var app = express();
var cnodUrl = 'https://cnodejs.org';

  superagent.get(cnodUrl)
    .end(function(err, sres){
      if(err) return next(err);

      //get all topic urls
      var topicUrls = [];
      // here $ is like jQuery, and sres.text is like the document.
      var $ = cheerio.load(sres.text);

      $('#topic_list .topic_title').each(function(index, element){
        element = $(element);
        // element.attr('href') is like /topic/xxxxxxxxx
        // use url.resolve to make a complete url for next request
        var href = url.resolve(cnodUrl, element.attr('href'));
        topicUrls.push(href);
      });
      console.log(topicUrls);


    });
