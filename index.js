require('dotenv').config();

const url = require('url');
const util = require('util');

// console.log(process.env);
// console.log('process argv: ' + process.argv);
// console.log('env var:');


const twitter_token = 'Bearer ' + (process.env.TWITTER_TOKEN);

// for (var i = 0; i < twitter_token.length; i++) {
//   console.log(twitter_token.charAt(i));
// }


const fs = require('fs');
let Parser = require('rss-parser');
//const templates = require('./templates.js')

const feedGenModule = require('./feedGeneration.js');

let axios = require('axios').default;

let my_parser = new Parser();

// create the required folders
fs.mkdir('./dist', () => { });


// const promises = [];

const promises_growth = [];
const promises_tech = [];
const promises_news = [];
const promises_finance = [];
const promises_twitter = [];

const my_sources_growth = JSON.parse(fs.readFileSync('sources_growth.json'));
const my_sources_tech = JSON.parse(fs.readFileSync('sources_tech.json'));
const my_sources_news = JSON.parse(fs.readFileSync('sources_news.json'));
const my_sources_finance = JSON.parse(fs.readFileSync('sources_finance.json'));
const my_sources_twitter = JSON.parse(fs.readFileSync('sources_twitter.json'));

my_sources_growth.items.forEach(function (item) {
  promises_growth.push(my_parser.parseURL(item.url));
});

my_sources_tech.items.forEach(function (item) {
  promises_tech.push(my_parser.parseURL(item.url));
});

my_sources_news.items.forEach(function (item) {
  promises_news.push(my_parser.parseURL(item.url));
});

my_sources_finance.items.forEach(function (item) {
  promises_finance.push(my_parser.parseURL(item.url));
});

my_sources_twitter.items.forEach(function (item) {
  promises_twitter.push(getTwitterFeed(item.twitter_id));
});

//console.log('promises_twitter first print: ' + JSON.stringify(promises_twitter));

Promise.allSettled(promises_growth).then((feeds) => {
  feedGenModule.feedGeneration(feeds, 'growth', './dist/growth.html');
});

Promise.allSettled(promises_tech).then((feeds) => {
  feedGenModule.feedGeneration(feeds, 'tech', './dist/tech.html');
});


Promise.allSettled(promises_news).then((feeds) => {
  feedGenModule.feedGeneration(feeds, 'news', './dist/news.html');
});


Promise.allSettled(promises_finance).then((feeds) => {
  feedGenModule.feedGeneration(feeds, 'finance', './dist/finance.html');

});

// function checkFulfilled(my_promise) {
//   return my_promise.status === 'fulfilled';
// }


Promise.allSettled(promises_twitter).then((twitterFeeds) => {
  feedGenModule.twitterFeedGeneration(twitterFeeds);

});



function getTwitterFeed(twitterID) {

  // const small_test = ('0n').toString('base64');
  // const my_token = 'Bearer ' + 'AAAAAAAAAAAAAAAAAAAAANcLeAEAAAAA3kd2d5jqU%2BbeSeBPMcXkJeHaE8Q%3Df782wwqrzkZqcZdzXR2SsXjkGkxABind8LDb8svKNpZlmnrx' + small_test;

  // const not_my_token = 'Bearer ' + (process.env.MY_HEMLIG_HEMLIS);

  // console.log('not_my_token: ' + twitter_token);

  // const checker_check = 'Björn Börjesson ' + my_token;
  // console.log('checker_check: ' + checker_check);
  
  const url = `https://api.twitter.com/2/users/${twitterID}/tweets`

  //console.log('twitter feed url: ' + url);
  

  let retGet = axios.get(url, { 
    headers: { 
      'Authorization': twitter_token } });
  

  // console.log('twitter feed headers: ' + JSON.stringify(retGet.headers));
  // console.log('twitter feed retget: ' + util.inspect(retGet));

  return retGet;
}

console.log('done');
