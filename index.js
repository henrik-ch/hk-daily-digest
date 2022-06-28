const fs = require('fs');
let Parser = require('rss-parser');
const templates = require('./templates.js')

let my_parser = new Parser();

const promises = [];
const my_sources = JSON.parse(fs.readFileSync('sources.json'));

// create the required folders
fs.mkdir('./dist', () => {});

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
    new_str = input_pubDate.replace(/(\d)(T)(\d)/, '$1 $3');
    sec_str = new_str.replace(/\.000Z/, '');
    third_str = sec_str.replace(/\+0000/, '');
    return third_str;
}

my_sources.sections.forEach((section) => {
    section.items.forEach((item) => {
        promises.push(my_parser.parseURL(item.url))
    });
});

// commented out previous
// Promise.all(promises).then((feeds) => {
//     let output = '';

//     feeds.forEach((feed, my_index) => {
//         output += '<section class="row">';
//             output += '<div class="col">';
//                 output += `<h2 class="h3">${feed.title}</h2>`;
//                 output += `<h3 class="h3">${my_index}</h3>`;
//                 output += '<ul class="mb-4">';
//                 output += feed.items.slice(0,10).map(itemTemplate).join('');
//                 output += '</ul>';
//             output += '</div>';
//         output += '</section>';

//     });


Promise.all(promises).then((feeds) => {
    let output = '';

    feeds.forEach((feed, my_index) => {
        output += '<div class="accordion-item">';
            output += `<h2 class="accordion-header" id="heading${my_index}">`;
                output += `<button class="accordion-button" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapse${my_index}" aria-expanded="true" aria-controls="collapse${my_index}">`;
                    output += `${feed.title}`;
                output += '</button>';
            output += '</h2>';

            output += `<div id="collapse${my_index}" class="accordion-collapse collapse " aria-labelledby="heading${my_index}"
            data-bs-parent="#accordionDigest">`;

                output += '<ul class="mb-4">';
                output += feed.items.slice(0,10).map(itemTemplate).join('');
                output += '</ul>';
            output += '</div>';

        output += '</div>';

    });



    output = templates.document(output);

    createFile('./dist/index.html', output);
});