const express = require('express');//include express framework
const request = require('request');//include request to manage data
const router = express.Router();//include router

//will be used eventually to crunch the numbers
const currencyConversion = (convertFrom, exchangeRate) => {
    let convertedAmount = (convertFrom * exchangeRate).toFixed(2);
    return convertedAmount;
}

//set home view
router.get('/', (req, res) => {
    res.render('index');
});

//set results view (GET)
router.get('/results', (req, res) => {
    res.render('results');
});

//set results view (POST)
router.post('/results', (req, res) => {
    let result;
    let exchangeRate;

    res.locals.number = req.body.number;
    res.locals.convertFrom = req.body.convertFrom;
    res.locals.convertTo = req.body.convertTo;

    //validation. If there is a problem with the inputs, render the error view and terminate the app to prevent errors
    if(res.locals.convertFrom === res.locals.convertTo || res.locals.number === 'e') {
        res.redirect('/error');
        exit();
    }

    //make the api call
    try {
        request(`https://api.fixer.io/latest?base=${res.locals.convertFrom}&symbols=${res.locals.convertFrom},${res.locals.convertTo}`, (error, response, body) => {

            if(error) {
                console.log('error:', error);
            }

            //handle the response data
            const APIResponse = JSON.parse(body);
            let exchangeRate = APIResponse.rates;

            exchangeRate = JSON.stringify(exchangeRate);
            exchangeRate = exchangeRate.split(":")[1];
            exchangeRate = exchangeRate.split("}")[0];

            result = currencyConversion(res.locals.number, exchangeRate);

            //this is the key bit of information, the converted amount
            return result;
        });
    } catch (error) {//in case of errors...
        console.error(`Error: ${error.message}`);
    }

    //set res.locals.result. Not sure how to do this synchronously, setTimeout is not ideal...
    setTimeout(function() {
        res.locals.result = result,
        res.render('results')
    }, 1000);
});

//set error views
router.get('/error', (req, res) => {
    res.render('error');
});

router.post('/error', (req, res) =>{
    res.render('error');
});

//export router
module.exports = router;
