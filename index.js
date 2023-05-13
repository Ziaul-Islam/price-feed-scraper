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

        $(elemSelector).each((parentIdx, parentElem) =>{
            //console.log(parentElem);
            if(parentIdx <= 9){
                $(parentElem).children().each((childIdx, childElem)=>{
                    const tdValue = $(childElem).text();
                    if(tdValue){
                        console.log(tdValue);
                    }
                })
            }
        })
        //console.log($);
    }
    catch(err){
        console.error(err);
    }
}

getPriceFeed();