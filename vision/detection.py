import cv2
from ultralytics import YOLO
import base64
import numpy as np
from collections import Counter

# modify this function to count differently
def detect_acne(encoded_image, confidence):

    # Load your model (adjust the path as needed)
    model = YOLO('best.pt')

    np_arr = np.frombuffer(encoded_image, np.uint8)

    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # Run inference on an image (adjust the image path as needed)
    results = model(image, show=False, conf=confidence)

    # A list to store the detected object names
    detected_objects = []

    # as iterate, progressive update the counts so you don't have to do it at the end
    # also go through results in high to low confidence
    # if first time seeing item add photo + create counter for it
    # redo in that way so you can pass the sub image encoded in base64 back to the front end
    # use passed image to front end to provide pictures of the skin issue to the person
    # also maybe provide annotated image so they can see
    # Iterate over the results, using an index for unique file names
    for idx, result in enumerate(results):
        # Render the image with annotations (returns a NumPy array in BGR format)
        annotated_img = result.plot()

        # Save the annotated image with a unique filename
        # filename = f'annotated_{filename}.jpg'
        # cv2.imwrite(filename, annotated_img)
        # print(f"Annotated image saved as: {filename}")

        # Iterate over the detected boxes in the current result
        # Each box contains a prediction, including the class index.
        for box in result.boxes:
            # Extract the class index.
            class_idx = int(box.cls)
            # Get the class name using the result's names dictionary.
            object_name = result.names[class_idx]
            detected_objects.append(object_name)

    def get_object_frequencies(detected_objects):
        # Count the frequency of each object in the detected_objects array
        object_counter = Counter(detected_objects)
        # Convert the counter to a list of tuples (object_name, frequency)
        object_frequencies = list(object_counter.items())
        object_frequencies.sort(key=lambda x: x[1], reverse=True)
        return object_frequencies
        
    return get_object_frequencies(detected_objects)
