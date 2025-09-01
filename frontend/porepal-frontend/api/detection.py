from collections import defaultdict
import requests
from dotenv import load_dotenv
import os

load_dotenv()  # load environment variables from .env file
ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY")

def detect_acne(raw_bytes, conf=0.1):

    print("Detecting acne...")

    import io
    from PIL import Image, ImageDraw
    import base64

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
    results = response.get('predictions', [])

    # Open image from raw bytes
    image = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
    draw = ImageDraw.Draw(image)

    bounding_boxes = []
    detected_objects = defaultdict(int)
    bounding_boxes = defaultdict(list)

    for result in results:
        classname = result['class']
        detected_objects[classname] += 1
        # Get bounding box coordinates
        x = result.get('x', 0)
        y = result.get('y', 0)
        width = result.get('width', 0)
        height = result.get('height', 0)
        # Calculate box corners
        left = int(x - width / 2)
        top = int(y - height / 2)
        right = int(x + width / 2)
        bottom = int(y + height / 2)
        # Save bounding box info
        bounding_boxes[classname].append([left, top, right, bottom])

    images_out = defaultdict(str)

    for classname, count in detected_objects.items():
        # Open image from raw bytes
        image = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
        draw = ImageDraw.Draw(image)

        for box in bounding_boxes[classname]:
            left, top, right, bottom = box
            draw.rectangle([left, top, right, bottom], outline="red", width=5)

        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

        images_out[classname] = img_str

    return {
        "frequencies": dict(detected_objects),
        "images": images_out
    }
