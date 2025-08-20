from collections import defaultdict
import requests
from dotenv import load_dotenv
import os

load_dotenv()  # load environment variables from .env file
ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY")

def detect_acne(raw_bytes, conf=0.1):

    print("Detecting acne...")

    # parameters for object detection
    API_KEY = ROBOFLOW_API_KEY
    MODEL_ID = "acne-kbm0q-axcj6/1"
    CONFIDENCE = conf

    # convert raw bytes into file payload
    payload = {"file": ("upload.jpg", raw_bytes, "application/octet-stream")}

    # query roboflow serverless deployment
    url = f"https://serverless.roboflow.com/{MODEL_ID}?api_key={API_KEY}&confidence={CONFIDENCE}"
    resp = requests.post(url, files=payload)
    response = resp.json()
    print(response)
    results = response['predictions']


    # A list to store the detected object names
    detected_objects = defaultdict(int)

    for idx, result in enumerate(results):
        classname = result['class']
        detected_objects[classname] += 1

    return detected_objects
