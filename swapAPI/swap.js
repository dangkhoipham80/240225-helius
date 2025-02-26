import fetch from 'cross-fetch';
import dotenv from "dotenv";

dotenv.config();  // Load biến môi trường từ file .env

async function getQuote(inputMint, outputMint, amount, slippageBps = 50) {
    console.log(`🔄 Lấy quote swap từ ${inputMint} -> ${outputMint} với số lượng ${amount}`);

    try {
        const quoteResponse = await fetch(
            `https://api.jup.ag/swap/v1/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}&restrictIntermediateTokens=true`
        );

        const quoteData = await quoteResponse.json();
        console.log("✅ Quote nhận được:", JSON.stringify(quoteData, null, 2));

        return quoteData;
    } catch (error) {
        console.error("❌ Lỗi khi lấy quote:", error);
        return null;
    }
}

// ======================
// 3️⃣ Gọi Hàm Lấy Quote
// ======================

// SOL (So111...) -> USDC (EPjF...)
const inputMint = "So11111111111111111111111111111111111111112"; // SOL
const outputMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
const amount = 100000000; // 1 SOL (vì SOL có 9 decimals)

getQuote(inputMint, outputMint, amount);
