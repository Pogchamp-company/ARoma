const path = require("path");
const express = require('express'),
    app = express();
const host = 'localhost';
const port = 8000;

var morgan = require('morgan')
app.use(morgan('combined'))

app.get('/ping', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({message: 'pong'});
});

function reactHandler(req, res) {
    res.statusCode = 200;
    res.sendFile(path.join(__dirname + '/templates/index.html'));
}

app.get('/', reactHandler)
app.get('/registration', reactHandler)
app.get('/login', reactHandler)
app.get('/cart', reactHandler)
app.get('/search_products', reactHandler)
app.get('/product/:id', reactHandler)
app.get('/edit_catalogs', reactHandler)
app.get('/step2/:id', reactHandler)
app.get('/step3/:id', reactHandler)
app.get('/edit_catalog_products/:id', reactHandler)
app.get('/new_product/:productId', reactHandler)
app.get('/edit_product/:productId', reactHandler)
app.get('/edit_product', reactHandler)
app.get('/orders', reactHandler)

app.use(express.static('static'));

app.listen(port, host, () => console.log(`Server listens http://${host}:${port}`));
