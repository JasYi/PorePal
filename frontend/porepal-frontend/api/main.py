# run using `uvicorn main:app --host 127.0.0.1 --port 5328`

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import base64
from detection import detect_acne
from ai_search import fetch_and_process_data
from collections import defaultdict

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/hello")
async def home():
    return {"message": "Hello, World!"}

# handle being able to upload multiple images
@app.post("/upload_multiple_images")
async def upload_multiple_images(request: Request):
    data = await request.json()
    if 'images' not in data:
        raise HTTPException(status_code=400, detail="No images provided")
    
    # print(data)
    
    # get the images from the data
    images = data['images']
    all_solutions = []
    
    # print(images)
    
    # loop through the images and detect the acne
    try:
        all_detected = []
        # iterate through images and get total sums for acne problems detected
        for image_data in images:
            image = base64.b64decode(image_data)
            print("Processing image...")
            detected = detect_acne(image, conf = 0.1)
            combined = defaultdict(int)
            for elem in detected + all_detected:
                combined[elem[0]] += elem[1]
            all_detected = list(combined.items())
            print("image detected: ", detected)
        
        # find solutions to all detected acne problems
        all_solutions = []
        for problem in all_detected:
            # find solutions to all detected acne problems
            solutions = await fetch_and_process_data(problem[0])
            all_solutions.append((problem[0], solutions))
        
        return {"message": "Images received successfully", "solutions": all_solutions}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# handle being able to upload a single image
@app.post("/upload_image")
async def upload_image(request: Request):
    data = await request.json()
    if 'image' not in data:
        raise HTTPException(status_code=400, detail="No image provided")

    image_data = data['image']
    try:
        image = base64.b64decode(image_data)
        # Process the image as needed
        detected = detect_acne(image, conf = 0.05)
        
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