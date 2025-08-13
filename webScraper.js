const { chromium } = require('playwright');
const cheerio = require('cheerio');
const { Feed } = require('feed');

async function scrapeToRSS(config) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  });
  
  try {
    await page.goto(config.url);
    await page.waitForLoadState('networkidle');
    const html = await page.content();
    
    const $ = cheerio.load(html);
    const articles = [];
    
    $(config.articleSelector).each((index, element) => {
      const titleEl = $(element).find(config.titleSelector);
      const linkEl = $(element).find(config.linkSelector);
      const descEl = $(element).find(config.descriptionSelector);
      
      if (titleEl.length && linkEl.length) {
        const title = titleEl.text().trim();
        const href = linkEl.attr('href');
        const url = href && href.startsWith('http') ? href : config.baseUrl + href;
        const description = descEl.length ? descEl.text().trim() : 'No summary available.';
        
        articles.push({
          title,
          url,
          description,
          pubDate: new Date()
        });
      }
    });
    
    const feed = new Feed({
      title: config.feedTitle,
      description: config.feedDescription,
      id: config.url,
      link: config.url,
      language: 'en',
      updated: new Date()
    });
    
    articles.forEach(article => {
      feed.addItem({
        title: article.title,
        id: article.url,
        link: article.url,
        description: article.description,
        date: article.pubDate
      });
    });
    
    return {
      title: config.feedTitle,
      link: config.url,
      items: articles.map(article => ({
        title: article.title,
        link: article.url,
        pubDate: article.pubDate.toISOString(),
        content: article.description
      }))
    };
    
  } finally {
    await browser.close();
  }
}

function scrapeWithTimeout(config, timeout = 15000) {
  return Promise.race([
    scrapeToRSS(config),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`Scraping timeout: ${config.url} took longer than ${timeout}ms`)), timeout)
    )
  ]);
}

module.exports = { scrapeToRSS, scrapeWithTimeout };