import httpx

TOKEN_ADDRESS = "8Fza2Fi3gqR44vTSjC3RYfTgbRndCEgrsU21FBjYpump"  # Poope Token Address

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


# Call the function to test
import asyncio
price = asyncio.run(get_token_price())
print(f"Price of Poope: {price}")
