const Apify = require('apify');
const fetch = require('node-fetch');

Apify.main(async () => {
    const url = (await Apify.getInput())['datasetURL'];
    // const url = 'https://api.apify.com/v2/datasets/u3Jqx075EvAQ5f0YB/items?clean=true&format=json';
    const data = await (await fetch(url)).json();

    const processed = {}
    data.forEach(item => {
        const url = item['url'];
        if (url in item) {
            const newPrice = item['price'];
            const currentCheapestItem = processed[url];
            if (newPrice < currentCheapestItem['price']) {
                processed[url] = item;
            }
        } else {
            processed[url] = item;
        }
    });

    const dataset = await Apify.openDataset('cheapestOffers');
    await dataset.pushData(Object.values(processed));
});
