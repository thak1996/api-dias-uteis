const express = require('express');
const axios = require('axios');
const serverless = require('serverless-http');

const app = express();
const router = express.Router();

app.use(express.json()); 
app.use(express.urlencoded({ extended : false }));

router.get('/', (req, res) => {
    res.status(200).send("API is running.");
})

router.get('/:year/:month', async (req, res) => {
    const year = req.params.year;
    const month = req.params.month - 1;

    if (month > 11 || month < 0 || year < 2000 || year > 2100)
        return res.status(400).json({
            error: "Data is invalid.",
        })

        const URL = `https://brasilapi.com.br/api/feriados/v1/${year}`;
        const response = await axios.get(URL);
        
        let date = new Date(year, month, 1);
        let diasUteis = 0;
        let holidaysOfMonth = [];
        
        for (const [key, value] of Object.entries(response.data)) {
            let splitStr = value.date.split('-');
            let holidayMonth = parseInt(splitStr[1]);

            if (holidayMonth == month + 1) {
                holidaysOfMonth.push(parseInt(splitStr[2]));
            }
        }

        while (date.getMonth() === month) {
            let today = date.getDate();
            if (date.getDay() != 0 && !(holidaysOfMonth.includes(today))) diasUteis++;
            date.setDate(today + 1);
        }

        res.status(200).json({
            diasUteis: diasUteis,
        });    
})

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);