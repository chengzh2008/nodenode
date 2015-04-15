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


      // use eventproxy to make async request to get the first comment for all topic
      var ep = new eventproxy();

      // let ep to listen the topic_html event many times.
      ep.after('topic_html', topicUrls.length, function(topics){
        topics = topics.map(function(topicPair){
          var topicUrl = topicPair[0];
          var topicHtml = topicPair[1];
          var $ = cheerio.load(topicHtml);
          return {
            title: $('.topic_full_tile').text().trim(),
            href: topicUrl,
            comment1: $('.reply_content').eq(0).text().trim()
          };
        });
        console.log('final:');
        console.log(topics);
      });



      topicUrls.forEach(function(topicUrl){
        superagent.get(topicUrl)
          .end(function(err, res){
            console.log('fetch ' + topicUrl + ' successful');
            ep.emit('topic_html', [topicUrl, res.text]);
          })
      })

    });


