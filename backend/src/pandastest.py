import os 
import pandas as pd 
from pandasai import Agent

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

uri = "mongodb+srv://soc:root@stockscluster.ffmfprp.mongodb.net/"
client = MongoClient(uri, server_api=ServerApi('1'))
stockCollection = client.stocks.stocks
userCollection = client.stocks.users
os.environ["PANDASAI_API_KEY"] = os.environ.get("PANDAS_AI_KEY")
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost:3000",
    "http://localhost:5173",
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/plotdata")
async def plotdata(email: str, request: Request):
    query = await request.json()
    query = query["body"]
    user = userCollection.find_one({"email": email})
    stocks = stockCollection.find({"user": user})
    data = [{"id": str(stock["_id"]), "name": stock["name"], "current_price": stock["current_price"], "quantity": stock["quantity"], "action": stock["action"], "time": stock["timestamp"]} for stock in stocks]
    agent = Agent(data)
    agent.chat(query)

if __name__ == "__main__":
    uvicorn.run("pandastest:app", port=5001, log_level="info", reload=True)