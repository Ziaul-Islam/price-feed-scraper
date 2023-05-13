const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

async function getPriceFeed(){
    try{
        const siteUrl = 'https://coinmarketcap.com/';

        const {data} = await axios({
            method: "GET",
            url: siteUrl
        });
        const $ = cheerio.load(data);
        const elemSelector = '#__next > div > div.main-content > div.cmc-body-wrapper > div > div:nth-child(1) > div.sc-beb003d5-2.bkNrIb > table > tbody > tr';
        const indexName = [
            'rank',
            'name',
            'price',
            '1h',
            '24h',
            '7D',
            'marketCap',
            'volume',
            'circulatingSupply'
        ];
        const coinAr = [];
        $(elemSelector).each((parentIdx, parentElem) =>{
            //console.log(parentElem);
            let keyIdx = 0;
            const coinObj = {};
            if(parentIdx <= 9){
                $(parentElem).children().each((childIdx, childElem)=>{
                    let tdValue = $(childElem).text(); 
                    if((keyIdx == 1) || (keyIdx == 6)){
                        tdValue = ($('p:first-child', $(childElem).html()).text());
                    }
                    if(tdValue){
                        //console.log(tdValue);
                        coinObj[indexName[keyIdx]] = tdValue;
                        keyIdx++;
                    }
                })
                coinAr.push(coinObj);
            }
        })
        return coinAr;
    }
    catch(err){
        console.error(err);
    }
}

const app = express();

app.get('/api/price-feed', async(req, res) => {
    try{
        const priceFeed = await getPriceFeed();

        return res.status(200).json({
            result : priceFeed
        });
    }
    catch(err){
        return res.status(500).json({
            err: err.toString()
        });
    }
})

app.listen(3000, ()=>{
    console.log('Crypto price feed running on port 3000');
})