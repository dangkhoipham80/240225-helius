import requests
import json

# API Key của bạn (nếu có, nếu không dùng Free Plan thì bỏ trống)
JUPITER_API_KEY = ""  # Nếu dùng Free Plan, để trống

# Danh sách token cần lấy giá
token_mints = [
    "6E3Xpkmz2CmZvXNMxEAcssisUd9PN8EJJvKyo38rpump",  # MANSORY Token
    "JCeoBX79HfatfaY6xvuNyCHf86hwgkCCWDpEycVHtime",  # toly's minutes Token
    "SASEF8mpRqE9DkcKLRvAuTiPyPnhroRxgCuxRAEtime"
]

# API mới của Jupiter
JUPITER_URL = "https://api.jup.ag/price/v2?ids=" + ",".join(token_mints)

# Headers mới (bắt buộc theo tài liệu)
headers = {
    "Content-Type": "application/json"
}
if JUPITER_API_KEY:
    headers["x-api-key"] = JUPITER_API_KEY  # Thêm API Key nếu có

# Gửi request đến API mới của Jupiter
try:
    response = requests.get(JUPITER_URL, headers=headers, timeout=10)
    response.raise_for_status()  # Kiểm tra lỗi HTTP
    price_data = response.json()

    # Hiển thị danh sách token và giá của chúng
    for mint in token_mints:
        token_price = price_data.get("data", {}).get(mint, {}).get("price", "N/A")
        print(f"Token Mint: {mint} - Giá: {token_price} USD")
except requests.exceptions.RequestException as e:
    print(f"Lỗi kết nối: {e}")
