const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();

app.use(cors());
app.use(morgan('tiny'));

function getResults(body) {
    // console.log(body);

    const $ = cheerio.load(body);
    const rows = $('li.cl-static-search-result');
    const results = [];

    // Get the script element containing the JSON data by its id
    const scriptElement = $('#ld_searchpage_results');
    // Get the JSON string from the script element's text content
    const jsonString = scriptElement.html();
    // Parse the JSON string into a JavaScript object
    const bodyObject = JSON.parse(jsonString);
    // Access the "itemListElement" array from the parsed object
    const itemListElementArray = bodyObject.itemListElement;
    // Log the array to the console
    console.log(itemListElementArray);

    // rows.each((index, element) => {
    //     const result = $(element);
    //     // console.log(result.html());
    //     const title = result.find('.title').text();
    //     const price = result.find('.price').text();
    //     // get the tect from an href attribute
    //     const image = result.find('a').attr('href');
    //     results.push({ title, price, image });
    // });

    itemListElementArray.forEach((element) => {
        const title = element.item.name;
        const price = element.item.offers.price;
        const image = element.item.image;
        results.push({ title, price, image });
    });

    return results;
}

app.get('/', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

// https://columbus.craigslist.org/search/msa?query=synth#search=1~gallery~0~11

app.get('/search/:location/:search_term', (req, res) => {
    const { location, search_term } = req.params;
    const url = `https://${location}.craigslist.org/search/msa?query=${search_term}`;
    fetch(url)
        .then((response) => response.text())
        .then(async (body) => {
            const results = await getResults(body);
            res.json({ results });
        })
        .catch((error) => {
            res.json({ error: error.message });
        });
});

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(express.response.statusCode || 500);
    res.json({ message: error.message });
});

app.listen(5000, () => {
    console.log('Server listening on http://localhost:5000');
});
