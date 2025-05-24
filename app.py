import os
import json
import uuid
import numpy as np
import cv2
import face_recognition
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Folder paths
DATASET_DIR = 'dataset'
ENCODINGS_FILE = 'dataset/data.json'
IMAGES_DIR = 'dataset/images'

# Ensure the images directory exists
os.makedirs(IMAGES_DIR, exist_ok=True)

# Load JSON file
def load_data():
    if os.path.exists(ENCODINGS_FILE):
        with open(ENCODINGS_FILE, 'r') as file:
            return json.load(file)
    else:
        return []

# Save data to JSON file
def save_data(data):
    with open(ENCODINGS_FILE, 'w') as file:
        json.dump(data, file, indent=4)

#Home page
@app.route('/')
def home():
    return render_template('index.html')

#Enlist Page
@app.route("/enlist")
def enlist():
    return render_template("enlist.html")

#About Page
@app.route("/about")
def about():
    return render_template("about.html")

# Add a new face to the dataset
@app.route('/add', methods=['POST'])
def add_user():
    img = request.files['image']
    name = request.form['name']
    age = request.form['age']
    gender = request.form['gender']
    unique_id = str(uuid.uuid4())

    # Save the image with the unique ID
    img_path = os.path.join(IMAGES_DIR, f'{unique_id}.jpg')
    img.save(img_path)

    # Load the image using OpenCV and convert it to RGB
    img_cv = cv2.imread(img_path)
    img_rgb = cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB)

    # Convert the image to face encoding
    encoding = face_recognition.face_encodings(img_rgb)

    if len(encoding) == 0:
        return jsonify({'message': 'No face found in the image.'})

    encoding = encoding[0].tolist()  # Convert to list for JSON compatibility

    # Load existing data from data.json
    data = load_data()

    # Check if the encoding already exists in the data
    for user in data:
        stored_encoding = np.array(user['encoding'])
        matches = face_recognition.compare_faces([stored_encoding], np.array(encoding))
        
        if matches[0]:
            # If a match is found, return a message saying the face already exists
            return jsonify({'message': 'Face Already Exists!'})

    # If no match is found, store the new face data
    user_data = {
        'id': unique_id,
        'name': name,
        'age': age,
        'gender': gender,
        'encoding': encoding
    }

    data.append(user_data)
    save_data(data)

    return jsonify({'message': 'Face added successfully!'})

# Recognize a user based on the uploaded image
@app.route('/recognize', methods=['POST'])
def recognize_user():
    img = request.files['image']
    image_path = 'temp_image.jpg'
    img.save(image_path)
    
    # Load the uploaded image using OpenCV and convert it to RGB
    img_cv = cv2.imread(image_path)
    img_rgb = cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB)

    # Get face encoding from the uploaded image
    uploaded_encoding = face_recognition.face_encodings(img_rgb)

    if len(uploaded_encoding) == 0:
        return jsonify({'message': 'No face found in the image.'}), 400
    
    uploaded_encoding = uploaded_encoding[0]

    # Load dataset and compare encodings
    data = load_data()
    for user in data:
        stored_encoding = np.array(user['encoding'])

        # Compare the face encodings
        matches = face_recognition.compare_faces([stored_encoding], uploaded_encoding)

        if matches[0]:
            user_data = {
                'name': user['name'],
                'age': user['age'],
                'gender': user['gender'],
                'image': f'FaceID/dataset/images/{user["id"]}.jpg'
            }
            os.remove(image_path)
            return jsonify(user_data)
        
    os.remove(image_path)
    return jsonify({'message': 'No matching face found.'})


if __name__ == '__main__':
    app.run(debug=True)