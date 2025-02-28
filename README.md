# Webhook
A webhook is a method for an application to send notifications or data to another application when an event occurs. Webhooks help systems interact with each other without the need to continuously poll for event statuses. Data is usually sent via an HTTP POST request, often in JSON or XML format.

# Helius
Helius is a platform that provides APIs and tools to help developers build and interact with blockchains, especially the **Solana** blockchain. Helius offers services such as webhooks to receive real-time notifications about events in the blockchain system, allowing applications to automatically process data without frequent checks.

# Blockchain
Blockchain is a distributed database technology where transactions are stored in "blocks" and linked together in a "chain". This ensures security and transparency, as data cannot be altered without the consensus of the network members.

# Solana (Sol)
**Solana** is a fast and low-cost blockchain designed to support decentralized transactions and applications (dApps). It uses a combination of **Proof of History (PoH)** and **Proof of Stake (PoS)** mechanisms, which increase transaction speed and reduce costs. Solana is a popular platform for decentralized finance (DeFi) applications and NFTs due to its superior speed and performance.

## Task
Helius provides **Webhook**.
Listens to the **Webhook** notifications.
Extracts transaction details.
Fetches the price of the **Token** token.
Monitors the events and prints the token price.

## Token
🔹 **Token**: Poope 
🔹 **CA**: 8Fza2Fi3gqR44vTSjC3RYfTgbRndCEgrsU21FBjYpump 
🔹 **Ticker**: $Poope

##
Webhook ID: 10aad75c-0554-4ba8-b82f-43e8e49a75be
API Key: ""
RPC URL: https://mainnet.helius-rpc.com/?api-key=f4f91815-d83a-4475-87bc-69a5563b11e5
Standard Websocket URL: wss://mainnet.helius-rpc.com/?api-key=f4f91815-d83a-4475-87bc-69a5563b11e5
Shared Eclipse URL: https://eclipse.helius-rpc.com/

## Tech
Python, FastAPI

## REST API

## ngrok
pip install pyngrok
ngrok http 8000 (after run iuvicorn app -> open cmd)
�  Route traffic by anything: https://ngrok.com/r/iep
Session   Status online
Account   Phạm Đăng Khôi(Plan:Free)                                                                                                                                             
Version   3.20.0                                                                                                                                                                  Region    United States (us)  
-> Webhook URL

28/2/2025 -> xong task get_prices_by_list_tokens by jupiter API bên samuraixbt
