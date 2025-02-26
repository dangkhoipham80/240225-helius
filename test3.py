import requests
import json

# Danh sách token cần so sánh giá
token_mints = {
    "MANSORY": "6E3Xpkmz2CmZvXNMxEAcssisUd9PN8EJJvKyo38rpump",  # MANSORY Token
    "TOLY": "JCeoBX79HfatfaY6xvuNyCHf86hwgkCCWDpEycVHtime"  # toly's minutes Token
}

# API của Jupiter
JUPITER_URL = "https://api.jup.ag/price/v2?ids=" + ",".join(token_mints.values())

# API của Coingecko (phải chuyển token Solana sang ID của Coingecko)
COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price?ids=mansory,tolys-minutes&vs_currencies=usd"

# Headers của Jupiter (nếu có API Key thì thêm)
headers = {
    "Content-Type": "application/json"
}

# Lấy giá từ Jupiter API
try:
    response_jupiter = requests.get(JUPITER_URL, headers=headers, timeout=10)
    response_jupiter.raise_for_status()
    price_jupiter = response_jupiter.json().get("data", {})
except requests.exceptions.RequestException as e:
    print(f"Lỗi kết nối Jupiter: {e}")
    price_jupiter = {}

# Lấy giá từ Coingecko API
try:
    response_coingecko = requests.get(COINGECKO_URL, timeout=10)
    response_coingecko.raise_for_status()
    price_coingecko = response_coingecko.json()
except requests.exceptions.RequestException as e:
    print(f"Lỗi kết nối Coingecko: {e}")
    price_coingecko = {}

# So sánh giá
print("\n🔍 So sánh giá Token giữa Jupiter và Coingecko:\n")
for token, mint in token_mints.items():
    price_jup = price_jupiter.get(mint, {}).get("price", "N/A")
    price_cg = price_coingecko.get(token.lower(), {}).get("usd", "N/A")
    print(f"🪙 {token} ({mint})")
    print(f"   - 🌍 Jupiter: {price_jup} USD")
    print(f"   - 📊 Coingecko: {price_cg} USD")
    print("-" * 40)
