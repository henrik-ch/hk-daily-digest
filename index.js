const fs = require('fs');
let Parser = require('rss-parser');
const templates = require('./templates.js')

const feedGenModule = require('./feedGeneration.js');


var axios = require('axios').default;

let my_parser = new Parser();

// create the required folders
fs.mkdir('./dist', () => { });


// const promises = [];

const promises_tech = [];
const promises_news = [];
const promises_finance = [];

const my_sources_tech = JSON.parse(fs.readFileSync('sources_tech.json'));
const my_sources_news = JSON.parse(fs.readFileSync('sources_news.json'));
const my_sources_finance = JSON.parse(fs.readFileSync('sources_finance.json'));

my_sources_tech.items.forEach(function (item) {
  promises_tech.push(my_parser.parseURL(item.url));
});

my_sources_news.items.forEach(function (item) {
  promises_news.push(my_parser.parseURL(item.url));
});

my_sources_finance.items.forEach(function (item) {
  promises_finance.push(my_parser.parseURL(item.url));
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

var config = {
  method: 'get',
  url: 'https://api.twitter.com/2/users/362022429/tweets',
  headers: { 
    'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANcLeAEAAAAA3kd2d5jqU%2BbeSeBPMcXkJeHaE8Q%3Df782wwqrzkZqcZdzXR2SsXjkGkxABind8LDb8svKNpZlmnrx0n', 
    'Cookie': 'guest_id=v1%3A165815153468067750'
  }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});

