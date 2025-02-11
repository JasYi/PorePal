import requests
import base64
import time

url = 'http://127.0.0.1:8000/upload_image'
image_path = 'skin.jpg'

start_time = time.time()

with open(image_path, 'rb') as image_file:
    image_data = base64.b64encode(image_file.read())
    base64_string = image_data.decode('utf-8')

files = {'image': base64_string}
response = requests.post(url, json=files)

end_time = time.time()
elapsed_time = end_time - start_time

print(f"Request took {elapsed_time:.2f} seconds")
print(response.status_code)
print(response.text)