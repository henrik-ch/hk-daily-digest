const fs = require('fs');
const templates = require('./templates.js')


const navbarListLookup = {
    "tech": `<li class="nav-item">
      <a class="nav-link active" aria-current="page" href="./tech.html">Tech</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="./news.html">News</a>
    </li>
    <li class="nav-item">
      <a class="nav-link " href="./finance.html">Finance</a>
    </li>`,
    "news": `<li class="nav-item">
      <a class="nav-link" aria-current="page" href="./tech.html">Tech</a>
    </li>
    <li class="nav-item">
      <a class="nav-link active" href="./news.html">News</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="./finance.html">Finance</a>
    </li>`,
    "finance": `<li class="nav-item">
      <a class="nav-link" aria-current="page" href="./tech.html">Tech</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="./news.html">News</a>
    </li>
    <li class="nav-item">
      <a class="nav-link active" href="./finance.html">Finance</a>
    </li>`
}


function generateNavbarList(input_pagetype) {
    var retStr = navbarListLookup[input_pagetype];
    return retStr;
}

function checkFulfilled(my_promise) {
    return my_promise.status === 'fulfilled';
}

module.exports.feedGeneration = function (feeds, feed_type, target_url) {
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

function createFile(fileName, data) {
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
