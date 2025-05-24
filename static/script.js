// Load Animation
const animation = lottie.loadAnimation({
    container: document.getElementById('lottie'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: '/static/lottie/animation.json',
});

// Animation segment
const segments = {
    INITIAL: [0, 0],
    RESET: [1, 5],
    PULSE: [6, 87],
    SUCCESS: [88, 153],
    UNSUCCESS: [154, 226],
};

// Segment player function
function playSegment(segment, loop = false, callback = null) {
    animation.stop();
    animation.loop = loop;
    animation.playSegments(segment, true);

    if (!loop && callback) {
        const completeHandler = () => {
            callback();
            animation.removeEventListener('complete', completeHandler);
        };
        animation.addEventListener('complete', completeHandler);
    }
}

animation.goToAndStop(segments.INITIAL[0], true);

// Webcam snapshot function
async function captureSnapshot() {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    try {
        // Open the webcam
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        await video.play();

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Stop the video stream
        stream.getTracks().forEach(track => track.stop());

        // Convert the canvas to a Blob
        return new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob), 'image/jpeg');
        });
    } catch (error) {
        console.error('Webcam error:', error);
        return null;
    }
}

// Recogninze Button Click Event
document.querySelector('.button').addEventListener('click', async () => {
    const button = document.querySelector('.button');
    button.disabled = true; 
    playSegment(segments.PULSE, true); 

    // Capture a snapshot
    const snapshot = await captureSnapshot();

    // Send the snapshot to the Flask server
    const formData = new FormData();
    formData.append('image', snapshot, 'snapshot.jpg');

    fetch('/recognize', {
        method: 'POST',
        body: formData,
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((err) => {
                    throw new Error(err.message || 'Unexpected error occurred');
                });
            }
            return response.json();
        })
        .then((data) => {
            if (data.name) {
                // Success logic
                playSegment(segments.SUCCESS, false, () => {
                    button.disabled = false; // Re-enable button
                    console.log('Recognition Success:', data);
                    // Add logic to show user details
                    alert(`User Recognized: 
Name: ${data.name} 
Age: ${data.age} 
Gender: ${data.gender}`);
                });
            } else if (data.message) {
                // Unknown face
                playSegment(segments.UNSUCCESS, false, () => {
                    button.disabled = false; // Re-enable button
                    alert(data.message); // Show the message, e.g., 'No matching face found.'
                });
                
            }
        })
        .catch((error) => {
            console.error('Error:', error.message);
            playSegment(segments.UNSUCCESS, false, () => {
                button.disabled = false; // Re-enable button
                alert(error.message || 'Recognition failed. Please try again.');
            });
            
        });
    
});


document.getElementById('upload').addEventListener('click', async () => {
    // Create a hidden file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    // Trigger the file explorer
    fileInput.click();

    // Add a change event listener to handle the selected file
    fileInput.addEventListener('change', function () {
        playSegment(segments.PULSE, true); // Start the pulse animation
        if (fileInput.files.length > 0) {
            const formData = new FormData();
            formData.append('image', fileInput.files[0]);

            // Send the image to the Flask backend
            fetch('/recognize', {
                method: 'POST',
                body: formData
            })
                .then(async (response) => {
                    const data = await response.json();

                    if (response.status === 400) {
                        // Alert for no face found or other errors
                        playSegment(segments.UNSUCCESS, false, () => {
                            alert(data.message); // Alert for no matching face found
                        }); // Stop animation here
                        alert(data.message); // Show alert with message
                    } else if ('name' in data) {
                        // Start SUCCESS animation and wait for it to complete
                        playSegment(segments.SUCCESS, false, () => {
                            // Once the SUCCESS animation is completed, show the alert
                            alert(`User recognized: 
Name: ${data.name}
Age: ${data.age}
Gender: ${data.gender}`);
                        });
                    } else {
                        // If no matching face found, show UNSUCCESS animation and then alert
                        playSegment(segments.UNSUCCESS, false, () => {
                            alert(data.message); // Alert for no matching face found
                        });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Something went wrong while processing the image!');
                });
        }
    });
});

