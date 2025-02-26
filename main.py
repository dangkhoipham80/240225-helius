from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx
import json
import requests

# Constants
API_KEY = "f4f91815-d83a-4475-87bc-69a5563b11e5"  # Helius API Key
WEBHOOK_ID = "10aad75c-0554-4ba8-b82f-43e8e49a75be"  # Replace with your actual webhook ID
TOKEN_ADDRESS = "8Fza2Fi3gqR44vTSjC3RYfTgbRndCEgrsU21FBjYpump"  # Poope Token Address
# 8Fza2Fi3gqR44vTSjC3RYfTgbRndCEgrsU21FBjYpump
WEBHOOK_URL = "https://af6e-203-205-27-8.ngrok-free.app/webhook"  # Your ngrok URL
RPC_URL = "https://mainnet.helius-rpc.com"  # Remove the api-key from the URL

# Initialize FastAPI
app = FastAPI()

# Add CORS middleware to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.post("/webhook")
async def receive_webhook(request: Request):
    data = await request.json()

    # Check if the data is a list or dictionary
    if isinstance(data, list):
        # Handle if data is a list (process the first element or iterate over it)
        print("Received data is a list:", data)
        data = data[0]  # Assuming the first element of the list contains the needed info
    elif isinstance(data, dict):
        # Handle if data is a dictionary
        print("Received data is a dictionary:", data)
    else:
        return {"status": "error", "message": "Unexpected data format"}

    # Extract transaction signature or other event details from webhook payload
    transaction_signature = data.get("signature") if isinstance(data, dict) else None
    
    if transaction_signature:
        # Fetch detailed transaction info from Helius RPC
        transaction_details = get_transaction_details(transaction_signature)
        
        # Print or process the transaction details (for debugging)
        print(f"Transaction Details: {json.dumps(transaction_details, indent=4)}")
        
        # Fetch and print the price of the Poope token
        token_price = await get_token_price()
        print(f"Current price of Poope: ${token_price}")
    
    return {"status": "success"}


# Fetch detailed transaction information using the Helius RPC getTransaction method
def get_transaction_details(signature):
    url = f"{RPC_URL}/?api-key={API_KEY}"  # Use the correct RPC URL
    
    # Preparing the payload for the POST request
    params = {
        "method": "getTransaction",  # Ensure method is correct
        "params": [signature],  # Pass the transaction signature
    }
    
    # Make the API request to Helius
    response = requests.post(url, json=params)
    
    if response.status_code == 200:
        return response.json()  # Return the response as JSON
    else:
        print(f"Error fetching transaction details: {response.text}")
        return {"error": "Failed to fetch transaction details"}

# Fetch the current price of the Poope token from DexScreener or another API
async def get_token_price():
    # API URL for token price
    api_url = f"https://api.dexscreener.com/tokens/v1/solana/{TOKEN_ADDRESS}"

    async with httpx.AsyncClient() as client:
        response = await client.get(api_url)

    if response.status_code == 200:
        data = response.json()
        print("API Response Data:", data)  # Print the response to inspect its structure

        # Since the response is a list, access the first item
        if data and isinstance(data, list):
            # Extract the USD price from the response
            price_usd = data[0].get('priceUsd')
            if price_usd:
                return price_usd  # Return the price in USD
            else:
                return "N/A"  # If priceUsd is not found, return "N/A"
        else:
            return "N/A"
    else:
        print(f"Error fetching token price: {response.text}")
        return "N/A"


# To run the FastAPI app with uvicorn, use:
# uvicorn main:app --reload
