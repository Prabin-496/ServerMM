import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_URL = 'https://www.mantramountain.com';

async function getPageLinks(url) {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const links = Array.from(dom.window.document.querySelectorAll('a'))
      .map(a => a.href)
      .filter(href => href.startsWith('/') || href.startsWith(BASE_URL))
      .map(href => href.startsWith('/') ? `${BASE_URL}${href}` : href)
      .filter(href => href !== BASE_URL + '/')  // Exclude the homepage
      .filter((href, index, self) => self.indexOf(href) === index);  // Remove duplicates
    return links;
  } catch (error) {
    console.error(`Error fetching ${url}: ${error.message}`);
    return [];
  }
}

async function generateSitemap() {
  const pagesToCrawl = [BASE_URL];
  const crawledPages = new Set();
  const sitemapEntries = [];

  while (pagesToCrawl.length > 0) {
    const currentUrl = pagesToCrawl.pop();
    if (crawledPages.has(currentUrl)) continue;
    crawledPages.add(currentUrl);
    console.log(`Crawling: ${currentUrl}`);
    const links = await getPageLinks(currentUrl);
    pagesToCrawl.push(...links.filter(link => !crawledPages.has(link)));
    const relativeUrl = currentUrl.replace(BASE_URL, '') || '/';
    sitemapEntries.push({
      url: relativeUrl,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: relativeUrl === '/' ? 'daily' : 'weekly',
      priority: relativeUrl === '/' ? '1.0' : '0.8'
    });
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapEntries.map(page => `
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
  `).join('')}
</urlset>`;

  const publicDir = path.resolve(__dirname, 'public');
  try {
    await fs.mkdir(publicDir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      console.error(`Error creating directory: ${error.message}`);
      return;
    }
  }

  try {
    await fs.writeFile(path.resolve(publicDir, 'sitemap.xml'), sitemapXml);
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error(`Error writing sitemap file: ${error.message}`);
  }
}

generateSitemap();