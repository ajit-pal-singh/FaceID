// Handle Add button click
document.getElementById('addButton').addEventListener('click', () => {
    document.getElementById('imageInput').click();
});

// Handle image selection and upload
document.getElementById('imageInput').addEventListener('change', async () => {
    const imageInput = document.getElementById('imageInput');
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;

    // Check if all fields are filled
    if (!name || !age || !gender) {
        alert('Please fill in all the fields.');
        return;
    }

    if (imageInput.files.length > 0) {
        const formData = new FormData();
        formData.append('image', imageInput.files[0]);
        formData.append('name', name);
        formData.append('age', age);
        formData.append('gender', gender);

        try {
            const response = await fetch('/add', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
            } else {
                alert(result.message || 'Failed to add user. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('An error occurred while uploading the image.');
        }
    }
});