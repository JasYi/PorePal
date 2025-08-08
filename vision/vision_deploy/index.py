
# run using `python main.py` or `flask run` (set FLASK_APP=main.py)

from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from detection import detect_acne
from ai_search import fetch_and_process_data
from collections import defaultdict

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"], supports_credentials=True)

@app.route("/api/hello", methods=["GET"])
def home():
    return jsonify({"message": "Hello, World!"})


# handle being able to upload multiple images
@app.route("/api/upload_multiple_images", methods=["POST"])
def upload_multiple_images():
    try:
        data = request.get_json()
        if 'images' not in data:
            return jsonify({"detail": "No images provided"}), 400

        images = data['images']
        all_detected = []
        for image_data in images:
            image = base64.b64decode(image_data)
            print("Processing image...")
            detected = detect_acne(image, conf=0.1)
            combined = defaultdict(int)
            for elem in detected + all_detected:
                combined[elem[0]] += elem[1]
            all_detected = list(combined.items())
            print("image detected: ", detected)

        # find solutions to all detected acne problems
        all_solutions = []
        for problem in all_detected:
            # find solutions to all detected acne problems
            # fetch_and_process_data may be async, so run synchronously if needed
            try:
                solutions = fetch_and_process_data(problem[0])
                if hasattr(solutions, '__await__'):
                    # If coroutine, run synchronously
                    import asyncio
                    solutions = asyncio.run(solutions)
            except Exception as e:
                solutions = [f"Error fetching solutions: {str(e)}"]
            all_solutions.append((problem[0], solutions))

        return jsonify({"message": "Images received successfully", "solutions": all_solutions})
    except Exception as e:
        return jsonify({"detail": str(e)}), 400


# handle being able to upload a single image
@app.route("/api/upload_image", methods=["POST"])
def upload_image():
    try:
        data = request.get_json()
        if 'image' not in data:
            return jsonify({"detail": "No image provided"}), 400

        image_data = data['image']
        image = base64.b64decode(image_data)
        detected = detect_acne(image, conf=0.05)
        print(detected)
        all_solutions = []
        for problem in detected:
            print(f"Detected problem: {problem}")
            try:
                solutions = fetch_and_process_data(problem[0])
                if hasattr(solutions, '__await__'):
                    import asyncio
                    solutions = asyncio.run(solutions)
            except Exception as e:
                solutions = [f"Error fetching solutions: {str(e)}"]
            all_solutions.append((problem[0], solutions))
        return jsonify({"message": "Image received successfully", "solutions": all_solutions})
    except Exception as e:
        return jsonify({"detail": str(e)}), 400


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5328, debug=True)