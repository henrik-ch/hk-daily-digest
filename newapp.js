let Parser = require('rss-parser');
let my_parser = new Parser();

(async () => {

    let feed = await my_parser.parseURL('https://www.theverge.com/rss/index.xml');
    console.log(feed.title);

    feed.items.forEach( item => {
        console.log(item.title + ':' + item.link)
    });

})();
