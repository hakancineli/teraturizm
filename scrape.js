// Use dynamic import for ESM-only package compatibility
(async () => {
  const scrape = (await import('website-scraper')).default;
  const startUrl = 'https://www.teraturizm.com/';
  const startHost = new URL(startUrl).host;

  try {
    await scrape({
      urls: [startUrl],
      directory: 'teraturizm-mirror',
      recursive: true,
      maxDepth: 4,
      requestConcurrency: 8,
      urlFilter: (url) => {
        try {
          const u = new URL(url);
          return u.host === startHost; // only same domain
        } catch (e) {
          return true; // relative URLs
        }
      },
      filenameGenerator: 'bySiteStructure',
      request: {
        headers: {
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
        },
        timeout: { request: 30000 }
      },
    });
    console.log('Mirror complete -> teraturizm-mirror/');
  } catch (err) {
    console.error('Mirror failed:', err?.message || err);
    process.exit(1);
  }
})();
