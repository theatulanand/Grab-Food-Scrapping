const puppeteer = require("puppeteer")
const fs = require('fs/promises')

async function start() {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto("https://food.grab.com/sg/en/restaurants?lng=en&search=Singapore%20General%20Hospital&support-deeplink=true&searchParameter=Singapore%20General%20Hospital", {
        timeout: 0,
    })

    let restro = [];

    await page.click('.ant-btn');

    await page.on("response", async (response) => {
        const url = await
            response.url();

        if (url.includes('https://portal.grab.com/foodweb/v2/search') & response.request().method() === 'POST') {
            try {
                let data = await response.json()
                console.log(await response.json());
                restro.push(data);
                await fs.writeFile("./data.json", JSON.stringify(restro, null, 4));
                await page.click('.ant-btn');
            } catch (error) {
                console.log(error)
            }
        }
    });

}



start()