import fetch from "cross-fetch";
import dotenv from "dotenv";
import { Connection, Keypair, Transaction, PublicKey } from "@solana/web3.js";
import { Wallet } from "@coral-xyz/anchor";
import bs58 from "bs58";

dotenv.config(); // Load biến môi trường từ file .env

// ======================
// 1️⃣ Nhập Private Key & Kết Nối Ví
// ======================
if (!process.env.PRIVATE_KEY) {
    console.error("❌ Lỗi: Không tìm thấy PRIVATE_KEY trong .env!");
    process.exit(1);
}

// Parse Private Key từ chuỗi JSON trong .env
const privateKeyArray = JSON.parse(process.env.PRIVATE_KEY);
const wallet = new Wallet(Keypair.fromSecretKey(new Uint8Array(privateKeyArray)));
console.log("🔑 Ví của bạn:", wallet.publicKey.toBase58());

// ======================
// 2️⃣ Kết Nối Solana (Devnet)
// ======================
const connection = new Connection("https://api.devnet.solana.com", {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 120000,  // ⚠️ Tăng thời gian xác nhận lên 2 phút (120 giây)
});
console.log("🔗 Kết nối thành công đến Solana Devnet!");

// ======================
// 3️⃣ Hàm Retry Transaction (Tự động thử lại)
// ======================
async function sendTransactionWithRetry(transaction, maxRetries = 3) {
    let attempts = 0;
    let lastError;
    
    while (attempts < maxRetries) {
        try {
            const txid = await connection.sendRawTransaction(transaction.serialize(), {
                skipPreflight: true,
                preflightCommitment: "confirmed",
            });

            console.log(`🚀 Attempt ${attempts + 1}: Transaction Sent - ${txid}`);

            // Xác nhận giao dịch
            const confirmation = await connection.confirmTransaction(txid, "finalized");
            if (confirmation.value.err) {
                throw new Error(`Transaction Failed: ${JSON.stringify(confirmation.value.err)}`);
            }

            console.log(`✅ Transaction Confirmed: ${txid}`);
            return txid;
        } catch (error) {
            lastError = error;
            console.warn(`⚠️ Attempt ${attempts + 1} Failed: ${error.message}`);
            attempts++;
        }
    }

    throw new Error(`❌ All ${maxRetries} attempts failed. Last error: ${lastError.message}`);
}

// ======================
// 4️⃣ Hàm Swap Token
// ======================
async function swapTokens(inputMint, outputMint, amount, slippageBps = 50) {
    console.log(`🔄 Bắt đầu swap từ ${inputMint} → ${outputMint} với số lượng ${amount}`);

    try {
        // 1️⃣ Lấy Quote
        console.log("🔎 Lấy quote...");
        const quoteResponse = await fetch(
            `https://api.jup.ag/swap/v1/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}&restrictIntermediateTokens=true`
        );
        const quoteData = await quoteResponse.json();

        if (!quoteData || !quoteData.outAmount) {
            console.error("❌ Lỗi: Không lấy được quote hợp lệ từ Jupiter!", quoteData);
            return;
        }
        console.log("✅ Quote nhận được:", JSON.stringify(quoteData, null, 2));

        // 2️⃣ Tạo Transaction Swap
        console.log("📝 Tạo transaction swap...");
        const swapResponse = await fetch("https://api.jup.ag/swap/v1/swap", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                quoteResponse: quoteData,
                userPublicKey: wallet.publicKey.toBase58(),
                asLegacyTransaction: true,  // ⚠️ Chặn sử dụng Address Lookup Tables
                dynamicComputeUnitLimit: true,
                dynamicSlippage: true,
                prioritizationFeeLamports: {
                    priorityLevelWithMaxLamports: {
                        maxLamports: 5000000,  // ⚠️ Tăng phí ưu tiên lên để tăng tốc transaction
                        priorityLevel: "veryHigh"
                    }
                }
            }),
        });

        const swapResult = await swapResponse.json();
        if (!swapResult.swapTransaction) {
            console.error("❌ Lỗi: Không thể tạo transaction swap!", swapResult);
            return;
        }

        // 3️⃣ Ký & Gửi Transaction
        console.log("🚀 Ký transaction...");
        const transactionBuffer = Buffer.from(swapResult.swapTransaction, "base64");
        const transaction = Transaction.from(transactionBuffer);
        transaction.sign(wallet.payer);

        console.log("📤 Gửi transaction với retry...");
        const txid = await sendTransactionWithRetry(transaction);
        console.log(`✅ Swap Thành Công! Transaction ID: ${txid}`);
        console.log(`🔗 Xem giao dịch tại: https://solscan.io/tx/${txid}?cluster=devnet`);
    } catch (error) {
        console.error("❌ Lỗi khi swap:", error);
    }
}

// ======================
// 5️⃣ Gọi Swap (SOL -> USDC)
// ======================
const inputMint = "So11111111111111111111111111111111111111112"; // SOL
const outputMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
const amount = 10000; // 1 SOL (đơn vị lamports)

swapTokens(inputMint, outputMint, amount);
