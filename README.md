# FaceID - A Static Face Recognition System

FaceID is a web-based face recognition system designed to identify individuals based on facial features. It utilizes machine learning algorithms and computer vision techniques to process and analyze faces from webcam captures or uploaded images. Upon successful identification, it displays details such as the user's name, age, and gender.

## Features

- **Face Recognition**: Identify known faces from live webcam feed or uploaded images.
- **Face Enlistment**: Add new users to the system by providing their name, age, gender, and an image.
- **User-friendly Interface**: A clean and intuitive web interface built with HTML, CSS, and JavaScript.
- **Lottie Animations**: Smooth and engaging animations for a better user experience.
- **Flask Backend**: Robust backend powered by Flask for handling API requests and data management.
- **OpenCV & face_recognition**: Utilizes powerful libraries for accurate face detection and encoding.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python (Flask)
- **Face Recognition**: OpenCV, dlib, face_recognition library
- **Animation**: Lottie for smooth animations

## Project Structure

```
FaceID/
├── dataset/
│   ├── images/         # Stores face images for enlisted users
│   └── data.json       # Stores face encodings and user metadata
├── static/
│   ├── images/         # Site icons and general images
│   ├── lottie/
│   │   └── animation.json # Lottie animation file
│   ├── about.css       # Stylesheet for the About page
│   ├── enlist.css      # Stylesheet for the Enlist page
│   ├── enlist.js       # JavaScript for Enlist page functionality
│   ├── script.js       # Main JavaScript for recognition logic
│   └── styles.css      # General stylesheets
├── templates/
│   ├── index.html      # Home page
│   ├── enlist.html     # Enlist new faces page
│   └── about.html      # About the project page
└── app.py              # Flask backend application
```

## How it Works

### Recognition Flow

1. The user navigates to the home page (`/`) and can choose to "Recognize" via webcam or "Upload" an image.
2. If "Recognize" is clicked, the system captures a snapshot from the user's webcam.
3. If an image is uploaded, the image file is sent directly.
4. The captured/uploaded image is sent to the Flask backend's `/recognize` endpoint.
5. The backend uses `face_recognition` to extract the face encoding from the image.
6. This encoding is compared against stored encodings in `data.json`.
7. If a match is found, the user's details (name, age, gender) are returned and displayed.
8. If no match or no face is detected, an appropriate message is shown.
9. Lottie animations provide visual feedback (pulsing, success, unsuccess).

### Enlistment Flow

1. The user navigates to the enlist page (`/enlist`).
2. Fill in name, age, and gender, then click "Add Face" to select an image.
3. Image and user details are sent to `/add` endpoint as FormData.
4. Backend saves the image and extracts encoding.
5. Checks for existing similar encodings to avoid duplicates.
6. If new, saves the data in `data.json`.
7. Returns success or failure message to the frontend.

## Setup and Installation

### Prerequisites

- Python 3.x
- pip

### Installation Steps

```bash
git clone <repository_url>
cd FaceID
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

If `requirements.txt` doesn't exist, install manually:

```bash
pip install Flask numpy opencv-python face_recognition dlib
```

> **Note:** Installing `dlib` may require extra steps. Refer to [dlib's documentation](http://dlib.net/compile.html).

### Run the Application

```bash
python app.py
```

Open browser and visit: [http://127.0.0.1:5000/](http://127.0.0.1:5000/)

## Usage

### Enlist a New Face

- Click on "enlist" tab.
- Fill in the Name, Age, Gender.
- Click "Add Face" and upload image.
- Alert confirms success or duplication.

### Recognize a Face

- Go to home page.
- Click "Recognize" or upload an image.
- System displays user details if matched.

## Contributing

Fork, raise issues, or submit PRs to contribute.

## License

This project is open-source and available under the MIT License.