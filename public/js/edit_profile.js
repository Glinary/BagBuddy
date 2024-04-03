var editProfileForm = document.getElementById('edit-profile-form');

var uploadBtn = document.getElementById('img-upload-btn');
var uploadIcon = document.getElementById('upload-icon');
var previewImg = document.getElementById('customImage');
var selectedImage = document.getElementById('selected-image');

var editedNameInput = document.getElementById('edited-name');
var nameFeedback = document.getElementById('edit-name-feedback');
var saveBtn = document.getElementById('save-profile-btn');



function selectImage(element) {
    // Reset border color for all images
    const images = document.querySelectorAll('.default-pfp');
    images.forEach(img => img.style.borderColor = '');

    const customImg = document.getElementById('img-upload-btn');
    customImg.style.borderColor = '';

    // Change border color of the clicked image
    element.style.borderColor = 'var(--main-blue)';

    const imageSrc = element.querySelector('img').src;
    selectedImage.value = imageSrc;
    console.log("Selected Image: ", selectedImage.value);
}

function selectCustomImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('customImage').src = e.target.result;
            document.getElementById('customImage').style.display = 'block';
            document.getElementById('upload-icon').style.display = 'none';

            // Reset border color for all images
            const images = document.querySelectorAll('.default-pfp');
            images.forEach(img => img.style.borderColor = '');

            // Change border color of the custom image container
            document.getElementById('img-upload-btn').style.borderColor = 'var(--main-blue)';
        }
        reader.readAsDataURL(input.files[0]);
    }
}


// Upload photo from local storage
uploadBtn.addEventListener('click', async function() {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', async function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function() {
            previewImg.src = reader.result;
            console.log("previewImg.src: ", previewImg.src);

            selectedImage.value = previewImg.src;
            console.log("selectedImage.value: ", selectedImage.value);

            previewImg.style.display = 'block';
            uploadIcon.style.display = 'none';

            // When user hover over the image, show the upload icon
            previewImg.addEventListener('mouseover', function() {
                uploadIcon.style.display = 'block';
                previewImg.style.display = 'none';
            });

            // When user move the mouse out of the image, hide the upload icon
            previewImg.addEventListener('mouseout', function() {
                uploadIcon.style.display = 'none';
                previewImg.style.display = 'block';
            });
        }
        reader.readAsDataURL(file);

    }
});



function validateName() {
    let nameLength = editedNameInput.value.length;
    console.log(editedNameInput);
  
    let regexName = /^[a-zA-Z]+$/; // only characters with no spaces are valid
  
    let isValidName = regexName.test(editedNameInput.value);
    console.log(isValidName);
  
    if (nameLength === 0) {
        nameFeedback.style.display = "none";
    } else {
        if (!isValidName) {
            nameFeedback.textContent = "Please enter a valid name. It must be letters only.";
            nameFeedback.style.color = "var(--main-red)";
            nameFeedback.style.display = "block";
        } else {
            if (nameLength >= 7 && nameLength <= 36) {
                // hide feedback
                nameFeedback.style.display = "none";
            } else {
                nameFeedback.textContent = "Name must be 7 to 36 characters.";
                nameFeedback.style.color = "var(--main-red)";
                nameFeedback.style.display = "block";
            }
        }
    }
}

editedNameInput.addEventListener("keyup", validateName);


// Save Edited Profile
saveBtn.addEventListener('click', async function(e) {
    e.preventDefault();

    console.log("----Edit Profile: Save button clicked.----");
    console.log("Selected Image: ", selectedImage.value);
    console.log("Edited Name: ", editedNameInput.value);

    var isValidName = false;
    var isImageSelected = false;

    // if user selected an image, save it
    if (selectedImage.value) {
        isImageSelected = true;
        console.log("Only new image is about to be saved.")
        console.log("Selected Image: ", selectedImage.value);
    }

    // if user edited the name, save it
    if (editedNameInput.value) {
        let editName = editedNameInput.value;

        // check if the name is already in use
        const response = await fetch(`/register/isNameValid`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ registerName: editName }),
        });

        const nameData = await response.json();
        console.log(nameData);

        if (nameData.message === "Name already in use.") {
            nameFeedback.textContent = "Name already in use.";
            nameFeedback.style.color = "var(--main-red)";
            nameFeedback.style.display = "block";
        }

        if (nameData.message === "Name is valid.") {
            nameFeedback.style.display = "none";

            console.log("Only new name is about to be saved.")
            isValidName = true;
        } else {
            console.log("Form data is invalid.");
        }
    }

    if (isValidName && isImageSelected) {
        const formData = new FormData(editProfileForm);
        const data = {
            name: formData.get("editedName"),
            profileImage: formData.get("selectedImage"),
        };

        console.log("Saving: Both name and image are about to be saved.")
        console.log("Form data: ", data);
        updateProfile(data);
    } else if (isValidName && !isImageSelected) {
        const formData = new FormData(editProfileForm);
        const data = {
            name: formData.get("editedName"),
        }

        console.log("Saving: Only new name is about to be saved.")
        console.log("Form data: ", data);
        updateProfile(data);
    } else if (!isValidName && isImageSelected) {
        const formData = new FormData(editProfileForm);
        const data = {
            profileImage: formData.get("selectedImage"),
        }

        console.log("Saving: Only new image is about to be saved.")
        console.log("Image data: ", data);
        updateProfile(data);
    } else {
        console.log("No changes made.");
        Swal.fire({
            position: "center",
            icon: "error",
            title: "No changes made.",
            showConfirmButton: false,
            timer: 1500,
        });
    }
    
});


async function updateProfile(data) {
    const response = await fetch(`/postEditProfile`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("result: ", result);

    if (result.message === "Profile updated successfully.") {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Profile updated successfully.",
            showConfirmButton: false,
            timer: 1500,
        });

        setTimeout(() => {
            window.location.href = `/profile`;
        }, 1500);
    } else {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Error updating profile.",
            showConfirmButton: false,
            timer: 1500,
        });
    }
}

function comingSoonCalendar() {
  Swal.fire({
    position: "center",
    title: "Calendar is coming soon!",
    showConfirmButton: true,
  });
}
