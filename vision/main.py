from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
import base64
from PIL import Image
import io
from detection import detect_acne
from ai_search import fetch_and_process_data
import asyncio
import uvicorn

app = FastAPI()

@app.get("/")
async def home():
    return {"message": "Hello, World!"}

@app.post("/upload_image")
async def upload_image(request: Request):
    data = await request.json()
    if 'image' not in data:
        raise HTTPException(status_code=400, detail="No image provided")

    image_data = data['image']
    try:
        image = base64.b64decode(image_data)
        # Process the image as needed
        detected = detect_acne(image)
        
        print(detected)
        
        all_solutions = []
        
        for problem in detected:
            # Process the detected problem
            print(f"Detected problem: {problem}")
            # Fetch and process data related to the detected problem
            solutions = await fetch_and_process_data(problem[0])
            print(solutions)
            all_solutions.append((problem[0], solutions))
        
        return {"message": "Image received successfully", "solutions": all_solutions}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# if __name__ == '__main__':
#     uvicorn.run(app, host="0.0.0.0", port=8000, debug=True)