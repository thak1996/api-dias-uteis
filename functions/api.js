const express = require('express');
const axios = require('axios');
const serverless = require('serverless-http');

const app = express();
const router = express.Router();

app.use(express.json()); 
app.use(express.urlencoded({ extended : false }));

const feriadosNatal = {
    0 : {
        "date" : "2024-01-06",
        "name" : "Dia de Reis",
        "type" : "local"
    },
    1 : {
        "date" : "2024-10-03",
        "name" : "Dia dos Mártires de Cunhaú e Uruaçu",
        "type" : "local"
    },
    2 : {
        "date" : "2024-11-21",
        "name" : "Dia de Nossa Senhora de Apresentação",
        "type" : "local"
    }
};

function getMonthInfo(month, year, response) {
    let date = new Date(year, month, 1);
    let qtdDiasUteis = 0;
    let holidaysOfMonth = [];
    let diasUteis = [];
    
    for (const [key, value] of Object.entries(response.data)) {
        let splitStr = value.date.split('-');
        let holidayMonth = parseInt(splitStr[1]);

        if (holidayMonth == month + 1) {
            holidaysOfMonth.push(parseInt(splitStr[2]));
        }
    }

    while (date.getMonth() === month) {
        let today = date.getDate();
        if (date.getDay() != 0 && !(holidaysOfMonth.includes(today))) {
            diasUteis.push(today);
            qtdDiasUteis++;
        }
        date.setDate(today + 1);
    }

    return {
        qtdDiasUteis: qtdDiasUteis,
        diasUteis: diasUteis,
        diasFeriados: holidaysOfMonth,
    };
}

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
        
    let data = getMonthInfo(month, year, response);

    res.status(200).json({
        monthData: data
    });    
})

router.get('/:year', async (req, res) => {
    const year = req.params.year;

    if (year < 2000 || year > 2100) 
        return res.status(400).json({
            error: "Data is invalid."
        });
  
    const URL = `https://brasilapi.com.br/api/feriados/v1/${year}`;
    const response = await axios.get(URL);

    let data = {};
    let totalDiasUteis = 0;
    let objResponse;

    for (let i = 0; i < 12; i++) {
        objResponse = getMonthInfo(i, year, response);
        totalDiasUteis += objResponse.qtdDiasUteis;
        data[i] = objResponse;
    }

    res.status(200).json({
        diasUteisTotal: totalDiasUteis,
        monthsData: data,
    });       
})

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);