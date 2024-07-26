from fastapi import FastAPI, Request
from contextlib import asynccontextmanager
import uvicorn
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from model import UserModel, StockModel
from pydantic import BaseModel
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from typing import List
from fastapi.responses import JSONResponse

import requests
import google.generativeai as genai
import json 
import re
import os
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from hashlib import sha256 
from datetime import datetime
import random

load_dotenv()

class Query(BaseModel):
    query: str

INTENTS = {}
USER_OTP = {}
API_KEY = ""
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')
COMPANY_NAME = {"apple": "aapl", "infosys": "infy", "ibm": "ibm", "tata": "tcs", "tcs": "tcs"}

uri = "mongodb+srv://soc:root@stockscluster.ffmfprp.mongodb.net/"
client = None
useruserCollection = None
stockCollection = None
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost:3000",
    "http://localhost:5173",
]
echios_symbols = ["ibm", "msft", "tsla", "race"]
echiosapiKey= 'GRP18XR0CK3T7'
echios_url = "https://echios.tech/price/" 
previous_echios_mock = None

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
    global client
    client = MongoClient(uri, server_api=ServerApi('1'))
    global userCollection 
    userCollection = client.stocks.users
    global stockCollection
    stockCollection = client.stocks.stocks
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)
    yield
    # Clean up the ML models and release the resources
    # post process after the server ends

conf = ConnectionConfig(
    MAIL_USERNAME = "dhananjay2002pai@gmail.com",
    MAIL_PASSWORD = "mxfzvwcytedlfewf",
    MAIL_FROM = "dhananjay2002pai@gmail.com",
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    MAIL_FROM_NAME = "stocksOnCloud"
)


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def clean_context(text: str):
    clean_txt = re.sub(r"\n", " ", text)
    clean_txt = re.sub(r"\s+", " ", clean_txt)
    clean_txt = clean_txt.strip()
    return clean_txt

@app.get("/test")
async def home():
    with open("src/intent.json") as f:
        data = json.load(f)
    data = userCollection.find()
    for user in data:
        print(user["name"], str(user["_id"]))
    # return data

@app.post("/register")
async def regsiter(request: Request):
    body = await request.json()
    password = body["password"]
    email = body["email"]
    user = userCollection.find_one({"email": email, "name": body["name"]})
    if user and user.get("email", "") == email: 
        return False
    hash = sha256(password.encode()).hexdigest()
    body["password"] = hash
    data = userCollection.insert_one(body)
    return str(data.inserted_id)

@app.post("/login")
async def login(request: Request):
    body = await request.json()
    email = body["email"]
    password = body["password"]
    data = userCollection.find_one({"email": email})
    hashed_pass = sha256(password.encode()).hexdigest()
    if hashed_pass == data["password"]:
        otp = ""
        for i in range(4):
            otp += str(random.randint(0,9))
        hashed_otp = sha256(otp.encode()).hexdigest()
        USER_OTP[email] = hashed_otp
        await sendmail(email, otp)
        print("Mail sent")
        return True
    return False


async def sendmail(email: str, otp: str):
    if not USER_OTP.get(email, ""): return "User not found"
    html = f"""<p>Hi \n
                Your OTP is : {otp} \n
                \n\n
                Thanks and Regards,
                DJ
            </p> """
    message = MessageSchema(
        subject="Verify OTP - stocksOnCloud",
        recipients=[email],
        body=html,
        subtype=MessageType.html)

    fm = FastMail(conf)
    await fm.send_message(message)
    return True


@app.post("/verifyOTP")
async def verify(request: Request):
    body = await request.json()
    email = body["email"]
    otp = body["otp"]
    hashed_otp = sha256(otp.encode()).hexdigest()
    if hashed_otp == USER_OTP.get(email, ""):
        return True 
    return False


@app.post("/query")
async def query(request: Request):
    data = await request.json()
    context = data["query"].lower()
    email = data["email"]
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
                            if COMPANY_NAME.get(company_name):
                                return await fetchData(COMPANY_NAME[company_name])
                if not company_name and "of" in tokens:
                    placeholder = tokens.index("of")
                    company_name = tokens[placeholder+1]
                    if COMPANY_NAME.get(company_name):
                        return await fetchData(COMPANY_NAME[company_name])
                if not company_name or "of" not in tokens:
                    new_query = data["query"] + ". Make sure the generated text is in plain string text is not formatted for prettification, I need the repsonse text in plain string. I want the answer in dictionary format so that I can parse the generated string as a dictionary in python. Example output: {'stock_name': ['stock_value', 'high', 'low', 'other data']}"
                    response = model.generate_content(new_query)
                    return response.text
                if company_name and COMPANY_NAME.get(company_name):
                    return await fetchData(COMPANY_NAME[company_name])
                
            # if INTENTS[token] == "buy":
            #     if "of" not in tokens:
            #         return "Stock name not detected"
            #     else:
            #         placeholder = tokens.index("of")
            #         company_name = tokens[placeholder+1]
            #         data = requests.post("http://localhost:5000/transaction", {"email": email, })

    new_query = data["query"] + ". Make sure the generated text is in dictionary format such that I can convert the generated data to dictionary easily in python using json.loads function to convert the text to dict and without new lines and without endlines"
    response = model.generate_content(new_query)
    print(response.text)
    data = json.loads(str(response.text))
    return data

@app.post("/transaction")
async def transact(request: Request):
    body = await request.json()
    email = body["email"]
    user = userCollection.find_one({"email": email})
    if not user:
        return False
    else:
        userId = str(user["_id"])
        print(userId)
        time = datetime.now()
        stock_data = {"name": body["stock_name"], "current_price": body["price"], "quantity": body["quantity"], "action": body["action"], "timestamp": time.strftime("%d/%m/%Y %H:%M:%S"), "user": user}
        data = stockCollection.insert_one(stock_data)
        return str(data.inserted_id)
    
@app.get("/getOrderBook")
async def getOrderBook(email: str):
    user = userCollection.find_one({"email": email})
    if not user:
        return {"success": False}
    stocks = stockCollection.find({"user": user})
    data = [{"id": str(stock["_id"]), "name": stock["name"], "current_price": stock["current_price"], "quantity": stock["quantity"], "action": stock["action"], "time": stock["timestamp"]} for stock in stocks]
    return data

@app.get("/echios")
async def getData(symbol: str):
    api_url = echios_url+symbol+"?apikey="+echiosapiKey
    global previous_echios_mock 
    try:
        data = requests.get(api_url)
        res = data.json()
        if not res:
            return previous_echios_mock
        previous_echios_mock = res 
        return res
    except:
        return previous_echios_mock
   

async def fetchData(symbol: str, interval = ""):
    if not interval:
        interval = "5min"
    url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval={interval}&apikey={API_KEY}'
    data = requests.get(url)
    return data.json()


            

if __name__ == "__main__":
    uvicorn.run("main:app", port=5000, log_level="info", reload=True)


