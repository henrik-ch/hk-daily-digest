require('dotenv').config();

const url = require('url');
const util = require('util');

console.log(process.env);


const fs = require('fs');
let Parser = require('rss-parser');
const templates = require('./templates.js')

const feedGenModule = require('./feedGeneration.js');

let axios = require('axios').default;

let my_parser = new Parser();

// create the required folders
fs.mkdir('./dist', () => { });


// const promises = [];

const promises_tech = [];
const promises_news = [];
const promises_finance = [];
const promises_twitter = [];

const my_sources_tech = JSON.parse(fs.readFileSync('sources_tech.json'));
const my_sources_news = JSON.parse(fs.readFileSync('sources_news.json'));
const my_sources_finance = JSON.parse(fs.readFileSync('sources_finance.json'));
const my_sources_twitter = JSON.parse(fs.readFileSync('sources_twitter.json'));

// find the twitter name for the given twitter ID
function getTwitterName(twitterID) {
  return my_sources_twitter.items.find( (item) =>  item.twitter_id === twitterID ).twitter_user;
}
console.log('luke twitter name: ' + getTwitterName('362022429'));

function getTwitterTitle(twitterID) {
  return my_sources_twitter.items.find( (item) =>  item.twitter_id === twitterID ).title;
}
console.log('luke twitter title: ' + getTwitterTitle('362022429'));

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

console.log('promises_twitter first print: ' + JSON.stringify(promises_twitter));

Promise.allSettled(promises_tech).then((feeds) => {
  feedGenModule.feedGeneration(feeds, 'tech', './dist/tech.html');
});


Promise.allSettled(promises_news).then((feeds) => {
  feedGenModule.feedGeneration(feeds, 'news', './dist/news.html');
});


Promise.allSettled(promises_finance).then((feeds) => {
  feedGenModule.feedGeneration(feeds, 'finance', './dist/finance.html');

});

function checkFulfilled(my_promise) {
  return my_promise.status === 'fulfilled';
}


Promise.allSettled(promises_twitter).then((feeds) => {
  let output = '';

  console.log('promises_twitter second print: ' + JSON.stringify(promises_twitter));

  console.log('feeds first print: ' + util.inspect(feeds));

  console.log('in twitter feeds settled: ' + feeds);

  const fulfilled_promises = feeds.filter(checkFulfilled);

  console.log('fulfilled promises count: ' + fulfilled_promises.length);

  fulfilled_promises.forEach((feed, my_index) => {

      const my_url = feed.value.config.url;

      console.log('my_url: ' + my_url);
      const url_processed = new URL(my_url);
      const url_path = url_processed.pathname;
      console.log('url pathname: ' + url_path);

      const splitPathArray = url_path.split('/');
      //console.log('splitPathArray: ' + splitPathArray);
      const twitter_id = splitPathArray[splitPathArray.length - 2];
      const twitter_name = getTwitterName(twitter_id);
      const twitter_title = getTwitterTitle(twitter_id);
      
      console.log('twitter_id: ' + twitter_id);
      console.log('twitter name: ' + getTwitterName(twitter_id));
      console.log('twitter title: ' + getTwitterTitle(twitter_id));

      output += '<div class="accordion-item">';
      output += `<h2 class="accordion-header" id="heading${my_index}">`;
      output += `<button class="accordion-button" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapse${my_index}" aria-expanded="true" aria-controls="collapse${my_index}">`;
      output += `${twitter_title}`;
      output += '</button>';
      output += '</h2>';

      output += `<div id="collapse${my_index}" class="accordion-collapse collapse " aria-labelledby="heading${my_index}"
            data-bs-parent="#accordionDigest">`;

      output += '<ul class="mb-4">';
      output += feed.value.data.data.slice(0, 5).map(item => feedGenModule.twitterItemTemplate(item, twitter_name)).join('');
      //output += '<p>test</p>';
      output += '</ul>';
      output += '</div>';

      output += '</div>';

    console.log('response ' + my_index + ': ');
    console.log(JSON.stringify(feed.value.data.data));
  });

  var navbarSection = feedGenModule.generateNavbarList('twitter');
  var template_doc = templates.document(output, navbarSection);

  feedGenModule.createFile('./dist/twitter.html', template_doc);

});



function getTwitterFeed(twitterID) {

  const my_token = 'Bearer ' + 'AAAAAAAAAAAAAAAAAAAAANcLeAEAAAAA3kd2d5jqU%2BbeSeBPMcXkJeHaE8Q%3Df782wwqrzkZqcZdzXR2SsXjkGkxABind8LDb8svKNpZlmnrx0n' + process.env.TWITTER_BEARER_TOKEN_END;

  const checker_check = 'Björn Börjesson ' + my_token;
  console.log('checker_check: ' + checker_check);
  
  const url = `https://api.twitter.com/2/users/${twitterID}/tweets`

  console.log('twitter feed url: ' + url);
  

  let retGet = axios.get(url, { 
    headers: { 
      'Authorization': my_token } });
  

  console.log('twitter feed headers: ' + JSON.stringify(retGet.headers));
  console.log('twitter feed retget: ' + util.inspect(retGet));

  return retGet;
}


// const my_token = 'Bearer ' + 'AAAAAAAAAAAAAAAAAAAAANcLeAEAAAAA3kd2d5jqU%2BbeSeBPMcXkJeHaE8Q%3Df782wwqrzkZqcZdzXR2SsXjkGkxABind8LDb8svKNp';

// var firstConfig = {
//   method: 'get',
//   url: 'https://api.twitter.com/2/users/362022429/tweets',
//   headers: {
//     'Authorization': my_token
//   }
// };


// console.log('first config is: ');
// console.log(firstConfig);

// axios(firstConfig)
//   .then(function (response) {
//     console.log('first response: ');

// axios.get('https://api.twitter.com/2/users/362022429/tweets', { 
//   headers: { 
//     'Authorization': my_token } })
//     .then(function (response) {
//     console.log('first response: ');
//     console.log(JSON.stringify(response.data));
//   })
//   .catch(function (error) {
//     console.log(error);
//   });



// axios.get('https://api.twitter.com/2/users/44196397/tweets', { 
//   headers: { 
//     'Authorization': my_token } })
//     .then(function (response) {
//       console.log('second response: ');
//       console.log(JSON.stringify(response.data));
//     })
//     .catch(function (error) {
//       console.log(error);
//     });


console.log('done');

//const auth_string = secres.data.headers['authorization'];
//console.log(auth_string)