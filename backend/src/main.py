from fastapi import FastAPI, Request
from contextlib import asynccontextmanager
import uvicorn
from pydantic import BaseModel

from collections import defaultdict
import requests
from typing import Optional
import google.generativeai as genai
import json 
import re
import os
from dotenv import load_dotenv

load_dotenv()

class Query(BaseModel):
    query: str

session = {}

INTENTS = {}
API_KEY = ""
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')
COMPANY_NAME = {"apple": "aapl", "infosys": "infy", "ibm": "ibm", "tata": "tcs"}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the ML model
    # pre process before the server starts
    global INTENTS 
    with open("src/intent.json") as file:
        data = json.load(file)
    INTENTS = data 
    global API_KEY
    API_KEY = os.environ.get("ALPHA_VANTAGE_API_KEY")
    yield
    # Clean up the ML models and release the resources
    # post process after the server ends

app = FastAPI(lifespan=lifespan)

def clean_context(text: str):
    clean_txt = re.sub(r"\n", " ", text)
    clean_txt = re.sub(r"\s+", " ", clean_txt)
    clean_txt = clean_txt.strip()
    return clean_txt

@app.get("/")
async def home():
    with open("src/intent.json") as f:
        data = json.load(f)
    return data 

@app.post("/query")
async def query(request: Request):
    data = await request.json()
    context = data["query"].lower()
    clean_text = clean_context(context)
    tokens = clean_text.split()
    for token in tokens:
        if INTENTS.get(token):
            if INTENTS[token] == "fetch":
                company_name = None
                if "of" not in tokens:
                    list_stocks = list(COMPANY_NAME.keys())
                    for stock in list_stocks:
                        if stock in tokens:
                            company_name = stock
                            return await fetchData(COMPANY_NAME[company_name])
                if not company_name and "of" in tokens:
                    placeholder = tokens.index("of")
                    company_name = tokens[placeholder+1]
                    return await fetchData(COMPANY_NAME[company_name])
                if not company_name or "of" not in tokens:
                    new_query = data["query"] + ". Make sure the generated text is in plain string text is not formatted for prettification, I need the repsonse text in plain string. I want the answer in dictionary format so that I can parse the generated string as a dictionary in python. Example output: {'stock_name': ['stock_value', 'high', 'low', 'other data']}"
                    response = model.generate_content(new_query)
                    return response.text
                return await fetchData(COMPANY_NAME[company_name])
    new_query = data["query"] + ". Make sure the generated text is in plain string text and should be without any '*' or neither any other such characters for designing"
    response = model.generate_content(new_query)
    return response.text
            

async def fetchData(symbol: str, interval = ""):
    if not interval:
        interval = "5min"
    url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval={interval}&apikey={API_KEY}'
    data = requests.get(url)
    return data.json()

            

if __name__ == "__main__":
    uvicorn.run("main:app", port=5000, log_level="info", reload=True)


