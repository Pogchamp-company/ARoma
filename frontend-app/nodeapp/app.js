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
app.get('/search_products/:id', reactHandler)
app.get('/product/:id', reactHandler)

app.use(express.static('static'));

app.listen(port, host, () => console.log(`Server listens http://${host}:${port}`));
