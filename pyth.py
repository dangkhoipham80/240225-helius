from fastapi import FastAPI, Request
import json

app = FastAPI()

@app.post("/webhook")
async def pyth_webhook(request: Request):
    data = await request.json()  # Nhận dữ liệu từ Pyth
    print("📊 Giá mới cập nhật:", json.dumps(data, indent=2))
    return {"status": "ok"}

# Chạy server với Uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
