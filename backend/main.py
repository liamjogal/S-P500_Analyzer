import requests
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from newsapi import NewsApiClient

from typing import Union
from datetime import datetime
import pandas as pd
from yahoo_fin import stock_info as si
from bs4 import BeautifulSoup
from wikiscrape import tickers, companies


# # Init
newsapi = NewsApiClient(api_key='b5d3671cfc5949f29664bf3ff9760d1c')


app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


headers = {
    "X-RapidAPI-Key": "149d3dfab1msh762b126f048c068p1f25d2jsn02d3bc95b6ea",
    "X-RapidAPI-Host": "apidojo-yahoo-finance-v1.p.rapidapi.com"
}


@app.get("/stock/{name}")
async def get_stock(name: str):
    url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete"
    querystring = {"q": name, "region": "US"}

    response = requests.get(url, headers=headers, params=querystring)
    return {"stock info": str(response.json())}


@app.get("/chart/{name}")
async def get_chart(name: str, interval: Union[str, None] = "1d", metric: Union[str, None] = "close", rang: Union[str, None] = "ytd"):
    url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-chart"
    querystring = {"symbol": name, 'interval': interval, "range":  rang, "region": "US", "includePrePost": "false",
                   "useYfid": "true", "includeAdjustedClose": "true", "events": "capitalGain,div,split"}
    response = requests.get(url, headers=headers, params=querystring)
    print(response.json())

    times = response.json()['chart']['result'][0]['timestamp']
    metrics = response.json(
    )['chart']['result'][0]['indicators']['quote'][0][metric]
    # for i in range(len(times)):
    #     times[i] = datetime.fromtimestamp(times[i]).strftime("%m/%d/%Y,")
    if rang == "1d":
        for i in range(len(times)):
            times[i] = datetime.fromtimestamp(times[i]).strftime("%H:%M")
    else:
        for i in range(len(times)):
            times[i] = datetime.fromtimestamp(times[i]).strftime("%m/%d/%Y,")
    return {"timestamps": times, "stats": metrics}


@app.get("/news/{name}")
async def get_news(name: str):
    all_articles = newsapi.get_everything(
        q=name, sources='bbc-news,the-verge,abc-news,abc-news-au,associated-press,australian-financial-review,axios,bbc-news,bleacher-report,bloomberg,business-insider,business-insider-uk,cbc-news,cbs-news,cnn,espn,financial-post,fortune,fox-news,independent,msnbc,nbc-news,newsweek,reuters,techcrunch,the-wall-street-journal,the-washington-post,the-washington-times,time,usa-today', language='en', sort_by='relevancy')
    print(all_articles['articles'])

    return {'articles': all_articles['articles'][:5]}


@app.get("/tickers")
async def get_ticks(index:  Union[str, None] = "s&p500"):
    if index == "s&p500":
        return {"tickers": tickers, 'companies': companies}
