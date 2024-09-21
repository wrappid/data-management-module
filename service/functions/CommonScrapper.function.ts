import { BasicCrawler } from "crawlee";
import promptSync from "prompt-sync";
import puppeteer, { Browser } from "puppeteer";

interface Selectors {
    [key: string]: string;
}

const getLinksFromSearch = async (keyword: string): Promise<string[]> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}`;
  await page.goto(searchUrl);

  let links: string[] = [];
  let hasNextPage = true;

  while (hasNextPage) {
    const newLinks = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll("a"));
      return anchors.map(anchor => (anchor as HTMLAnchorElement).href).filter(href => href.startsWith("http"));
    });
    links = links.concat(newLinks);

    hasNextPage = await page.evaluate(() => {
      const nextButton = document.querySelector("#pnnext");
      if (nextButton) {
        (nextButton as HTMLElement).click();
        return true;
      }
      return false;
    });

    if (hasNextPage) {
      await page.waitForNavigation({ waitUntil: "networkidle0" });
    }
  }

  await browser.close();
  return links;
};

const scrapeData = async (browser: Browser, url: string, selectors: Selectors): Promise<{ [key: string]: string }> => {
  const page = await browser.newPage();
  console.log(`Scraping data from ${url}`);
  await page.goto(url);

  const data = await page.evaluate((selectors: Selectors) => {
    const getText = (selector: string) => (document.querySelector(selector) as HTMLElement)?.innerText.trim() || "";
    const getAllText = (selector: string) => Array.from(document.querySelectorAll(selector)).map(el => (el as HTMLElement).innerText.trim());

    const result: { [key: string]: string } = {};
    for (const [key, selector] of Object.entries(selectors)) {
      result[key] = getText(selector) || getAllText(selector)[0] || "";
    }
    return result;
  }, selectors);

  await page.close();
  console.log(`Scraped data from ${url}:`, data);
  return data;
};

const scrapePaginatedData = async (browser: Browser, url: string, nextButtonSelector: string, selectors: Selectors): Promise<{ [key: string]: string }[]> => {
  const page = await browser.newPage();
  console.log(`Navigating to ${url}`);
  await page.goto(url);

  let hasNextPage = true;
  const allData: { [key: string]: string }[] = [];

  while (hasNextPage) {
    console.log(`Scraping data from ${url}`);
    const data = await page.evaluate((selectors: Selectors) => {
      const getText = (selector: string) => (document.querySelector(selector) as HTMLElement)?.innerText.trim() || "";
      const getAllText = (selector: string) => Array.from(document.querySelectorAll(selector)).map(el => (el as HTMLElement).innerText.trim());

      const result: { [key: string]: string } = {};
      for (const [key, selector] of Object.entries(selectors)) {
        result[key] = getText(selector) || getAllText(selector)[0] || "";
      }
      return result;
    }, selectors);

    allData.push(data);

    hasNextPage = await page.evaluate((nextButtonSelector: string) => {
      const nextButton = document.querySelector(nextButtonSelector);
      if (nextButton) {
        (nextButton as HTMLElement).click();
        return true;
      }
      return false;
    }, nextButtonSelector);

    if (hasNextPage) {
      console.log("Navigating to next page...");
      await page.waitForNavigation({ waitUntil: "networkidle0" });
    }
  }

  await page.close();
  console.log(`Scraped all paginated data from ${url}`);
  return allData;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const commonscrapper = async () => {
  const prompt = promptSync();
  const keyword = prompt("Enter the keyword to search for websites: ");
  const selectors: Selectors = {
    title: "title",
    description: "meta[name=\"description\"]"
  };

  const links = await getLinksFromSearch(keyword);
  const chunksize = 5;
  const delayTime = 5000;
  const browser = await puppeteer.launch();

  try {
    for (let i = 0; i < links.length; i += chunksize) {
      const chunk = links.slice(i, i + chunksize);
      for (const link of chunk) {
        const data = await scrapeData(browser, link, selectors);
        console.log(data);
      }
      console.log(`Please wait for ${delayTime / 1000} seconds...`);
      await delay(delayTime);
    }
  } catch (error) {
    console.error("Error during scraping:", error);
  } finally {
    await browser.close();
  }
};

// Create a BasicCrawler - the simplest crawler that enables
// users to implement the crawling logic themselves.
const prompt = promptSync();
const userUrls = prompt("Enter the URLs to crawl, separated by commas: ").split(",").map(url => url.trim());

const crawler = new BasicCrawler({
  async requestHandler({ pushData, request, sendRequest, log }) {
    const { url } = request;
    log.info(`Processing ${url}...`);

    const { body } = await sendRequest();

    await pushData({
      url,
      html: body,
    });
  },
});

// Add user-provided URLs to the crawler.
await crawler.addRequests(userUrls);
await crawler.run();

console.log("Crawler finished.");

export {
  commonscrapper,
  scrapePaginatedData,
  crawler,
};
