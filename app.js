const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended:false}));

app.set('view engine', 'pug');

const routes = require('./routes');

app.use(routes);

app.listen(4000);
