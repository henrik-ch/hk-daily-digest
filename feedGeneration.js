const fs = require('fs');
const templates = require('./templates.js')

const my_sources_twitter = JSON.parse(fs.readFileSync('sources_twitter.json'));

// find the twitter name for the given twitter ID
function getTwitterName(twitterID) {
  return my_sources_twitter.items.find( (item) =>  item.twitter_id === twitterID ).twitter_user;
}
//console.log('luke twitter name: ' + getTwitterName('362022429'));

function getTwitterTitle(twitterID) {
  return my_sources_twitter.items.find( (item) =>  item.twitter_id === twitterID ).title;
}
//console.log('luke twitter title: ' + getTwitterTitle('362022429'));



const navbarListLookup = {
  "growth": `<li class="nav-item">
      <a class="nav-link active" aria-current="page" href="./growth.html">Growth</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" aria-current="page" href="./tech.html">Tech</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="./news.html">News</a>
    </li>
    <li class="nav-item">
      <a class="nav-link " href="./finance.html">Finance</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="./twitter.html">Twitter</a>
  </li>`,
  "tech": `<li class="nav-item">
      <a class="nav-link" aria-current="page" href="./growth.html">Growth</a>
    </li>
    <li class="nav-item">
      <a class="nav-link active" aria-current="page" href="./tech.html">Tech</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="./news.html">News</a>
    </li>
    <li class="nav-item">
      <a class="nav-link " href="./finance.html">Finance</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="./twitter.html">Twitter</a>
  </li>`,
  "news": `<li class="nav-item">
      <a class="nav-link" aria-current="page" href="./growth.html">Growth</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" aria-current="page" href="./tech.html">Tech</a>
    </li>
    <li class="nav-item">
      <a class="nav-link active" href="./news.html">News</a>
    </li>
    <li class="nav-item">
      <a class="nav-link " href="./finance.html">Finance</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="./twitter.html">Twitter</a>
  </li>`,
  "finance": `<li class="nav-item">
      <a class="nav-link" aria-current="page" href="./growth.html">Growth</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" aria-current="page" href="./tech.html">Tech</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="./news.html">News</a>
    </li>
    <li class="nav-item">
      <a class="nav-link active" href="./finance.html">Finance</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="./twitter.html">Twitter</a>
  </li>`,
  "twitter": `<li class="nav-item">
      <a class="nav-link" aria-current="page" href="./growth.html">Growth</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" aria-current="page" href="./tech.html">Tech</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="./news.html">News</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="./finance.html">Finance</a>
    </li>
    <li class="nav-item">
    <a class="nav-link active" href="./twitter.html">Twitter</a>
  </li>`
}


function generateNavbarList(input_pagetype) {
  var retStr = navbarListLookup[input_pagetype];
  return retStr;
}

function checkFulfilled(my_promise) {
  return my_promise.status === 'fulfilled';
}

function feedGeneration(feeds, feed_type, target_url) {
  //function feedGeneration(feeds, feed_type, target_url) {

  let output = '';

  const fulfilled_promises = feeds.filter(checkFulfilled);

  fulfilled_promises.forEach((feed, my_index) => {
    output += '<div class="accordion-item">';
    output += `<h2 class="accordion-header" id="heading${my_index}">`;
    output += `<button class="accordion-button" type="button" data-bs-toggle="collapse"
                  data-bs-target="#collapse${my_index}" aria-expanded="true" aria-controls="collapse${my_index}">`;
    output += `${feed.value.title}`;
    output += '</button>';
    output += '</h2>';

    output += `<div id="collapse${my_index}" class="accordion-collapse collapse " aria-labelledby="heading${my_index}"
              data-bs-parent="#accordionDigest">`;

    output += '<ul class="mb-4">';
    output += feed.value.items.slice(0, 10).map(itemTemplate).join('');
    output += '</ul>';
    output += '</div>';

    output += '</div>';

  });

  var navbarSection = generateNavbarList(feed_type);
  var template_doc = templates.document(output, navbarSection);

  createFile(target_url, template_doc);
}

function twitterFeedGeneration(feeds) {
  let output = '';

  //console.log('promises_twitter second print: ' + JSON.stringify(promises_twitter));
  //console.log('feeds first print: ' + util.inspect(feeds));
  //console.log('in twitter feeds settled: ' + feeds);
  const fulfilled_promises = feeds.filter(checkFulfilled);

  const reduced_fulfilled_promises = fulfilled_promises.map((feed) => {

    const my_url = feed.value.config.url;
    const url_processed = new URL(my_url);
    const url_path = url_processed.pathname;
    const splitPathArray = url_path.split('/');
    const twitter_id = splitPathArray[splitPathArray.length - 2];
    const twitter_name = getTwitterName(twitter_id);
    const twitter_title = getTwitterTitle(twitter_id);
    const tweets = feed.value.data.data.slice(0, 5);

    return {
      twitter_id: twitter_id,
      twitter_name: twitter_name,
      twitter_title: twitter_title,
      tweets: tweets,
    };
  });

  const sorted_reduced_fulfilled_promises = [...reduced_fulfilled_promises].sort((a, b) =>
    new Date(b.tweets[0].created_at) - new Date(a.tweets[0].created_at));


  //console.log('fulfilled promises count: ' + fulfilled_promises.length);
  sorted_reduced_fulfilled_promises.forEach((feed, my_index) => {

    //const my_url = feed.value.config.url;

    //console.log('my_url: ' + my_url);
    //const url_processed = new URL(my_url);
    //const url_path = url_processed.pathname;
    //console.log('url pathname: ' + url_path);
    //const splitPathArray = url_path.split('/');
    //console.log('splitPathArray: ' + splitPathArray);
    // const twitter_id = splitPathArray[splitPathArray.length - 2];
    // const twitter_name = getTwitterName(twitter_id);
    // const twitter_title = getTwitterTitle(twitter_id);

    const twitter_id = feed.twitter_id;
    const twitter_name = feed.twitter_name;
    const twitter_title = feed.twitter_title;
    const tweets = feed.tweets;

    // console.log('twitter_id: ' + twitter_id);
    // console.log('twitter name: ' + getTwitterName(twitter_id));
    // console.log('twitter title: ' + getTwitterTitle(twitter_id));
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
    output += tweets.map(item => twitterItemTemplate(item, twitter_name)).join('');
    //output += '<p>test</p>';
    output += '</ul>';
    output += '</div>';

    output += '</div>';

    //console.log('response ' + my_index + ': ');
    //console.log(JSON.stringify(feed.value.data.data.slice(0,2)));
  });

  var navbarSection = generateNavbarList('twitter');
  var template_doc = templates.document(output, navbarSection);

  createFile('./dist/twitter.html', template_doc);
}


function createFile (fileName, data) {
  fs.writeFile(fileName, data, (err) => {
    if (!err) {
      console.log('File created: ' + fileName);
    }
  });
}

function itemTemplate(item) {
  // console.log("item link: " + item.link);
  // console.log("item title: " + item.title);
  // console.log("item pubDate: " + item.pubDate);
  // console.log("pubDate Display: " + pubDateDisplay(item.pubDate));

  return `<li class="mb-1">
        <a rel="noopener" target="_blank" href="${item.link}" title="${item.title}">${item.title}</a>
        <time datetime="${item.pubDate}" class="ps-2 small">${pubDateDisplay(item.pubDate)}</time>
    </li>`
}

function pubDateDisplay(input_pubDate) {
  var new_str = input_pubDate.replace(/(\d)(T)(\d)/, '$1 $3');
  var sec_str = new_str.replace(/\.000Z/, '');
  var third_str = sec_str.replace(/\+0000/, '');
  return third_str;
}


// module.exports.feedGeneration = function (

function twitterItemTemplate(item, user_name) {
  //console.log("item id: " + item.id);
  //console.log("item text: " + item.text);
  // console.log("item pubDate: " + item.pubDate);
  // console.log("pubDate Display: " + pubDateDisplay(item.pubDate));


  // make the link url
  let link_url = `https://twitter.com/${user_name}/status/${item.id}`;
  //console.log("link_url: " + link_url);


  // return `<li class="mb-1">
  //   <p>text</p>
  // </li>`


  return `<li class="mb-1">
        <a rel="noopener" target="_blank" href="${link_url}">${item.text}</a>
        <time datetime="${item.pubDate}" class="ps-2 small">${pubDateDisplay(item.created_at)}</time>
    </li>`
}

module.exports.feedGeneration = feedGeneration;
module.exports.twitterFeedGeneration = twitterFeedGeneration;
module.exports.generateNavbarList = generateNavbarList;
module.exports.createFile = createFile;