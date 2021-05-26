const Apify = require('apify');

Apify.main(async () => {
    const dataset = await Apify.openDataset('offers');
    const data = (await dataset.getData())['items'];

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

    const dataset2 = await Apify.openDataset('cheapestOffers');
    await dataset2.pushData(Object.values(processed));
});
