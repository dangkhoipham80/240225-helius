import dotenv from "dotenv";
import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import { Wallet } from '@coral-xyz/anchor';

dotenv.config();  // Load biến môi trường từ .env

// ======================
// 1️⃣ Nhập Private Key
// ======================
if (!process.env.PRIVATE_KEY) {
    console.error("❌ Lỗi: Không tìm thấy PRIVATE_KEY trong .env!");
    process.exit(1);
}

// Parse private key từ chuỗi JSON trong .env
const privateKeyArray = JSON.parse(process.env.PRIVATE_KEY);
const wallet = new Wallet(Keypair.fromSecretKey(new Uint8Array(privateKeyArray)));

console.log("🔑 Ví của bạn:", wallet.publicKey.toBase58());

// ======================
// 2️⃣ Kết nối đến Helius (Mainnet)
// ======================
if (!process.env.HELIUS_API_KEY) {
    console.error("❌ Lỗi: Hãy đặt `HELIUS_API_KEY` trong file .env!");
    process.exit(1);
}

const heliusConnection = new Connection(`https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`);
console.log("🔗 Kết nối thành công đến Helius với API Key:", process.env.HELIUS_API_KEY);

// ======================
// 3️⃣ Kết nối Devnet (Test)
// ======================
const devnetConnection = new Connection(clusterApiUrl('devnet'), 'confirmed');

(async () => {
    try {
        // Kiểm tra số dư trên Devnet
        const balance = await devnetConnection.getBalance(wallet.publicKey);
        console.log(`💰 Số dư trên Devnet: ${balance / 1e9} SOL`);

        // Kiểm tra số dư trên Mainnet (Helius)
        const mainnetBalance = await heliusConnection.getBalance(wallet.publicKey);
        console.log(`💰 Số dư trên Mainnet: ${mainnetBalance / 1e9} SOL`);
    } catch (error) {
        console.error("❌ Lỗi khi lấy số dư:", error);
    }
})();

// Nếu số dư trên Devnet = 0, bạn cần airdrop 2 SOL:
// solana airdrop 2