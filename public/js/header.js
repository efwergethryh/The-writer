

window.onscroll = function () { myFunction() };

// Get the navbar
var navbar = document.getElementById("navbar");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
        console.log(sticky);
    } else {
        navbar.classList.remove("sticky");
    }
}
document.getElementById('signout').addEventListener('click', () => {
    // Send a request to logout endpoint
    fetch('/logout', {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message); // Output the logout message
            // Optionally, redirect to the login page or perform other actions
            window.location.assign('/login'); // Example redirect to login page
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
});

function redirect(route) {
    window.location.href = `localhost:3000${route}`
}

// Pop up
// Get the popup container and close button elements
var popupContainer = document.getElementById('popupContainer');
var closeButton = document.getElementById('closeButton');

// Get the button that triggers the popup
var popupButton = document.getElementById('newBlog');

// Add event listener to the popup button to show the popup
popupButton.addEventListener('click', function () {
    popupContainer.style.display = 'block';
});

// Add event listener to the close button to hide the popup
closeButton.addEventListener('click', function () {
    popupContainer.style.display = 'none';
});
// ---------------------------------------------------------------------------
var edit_profile = document.getElementById('editprofile');

var closeButton_edit = document.getElementById('closeButton_edit');

// Get the button that triggers the popup
var popupButton_edit = document.getElementById('editProfile');

// Add event listener to the popup button to show the popup
popupButton_edit.addEventListener('click', function () {
    edit_profile.style.display = 'block';
});

// Add event listener to the close button to hide the popup
closeButton_edit.addEventListener('click', function () {
    edit_profile.style.display = 'none';
});

//----------------------------------confirm--------------------------------------




//----------------------------------------------------------------------------
$(document).ready(function () {

    $("#form-image").change(function (data) {

        var imageFile = data.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(imageFile);

        reader.onload = function (evt) {
            $('#imagePreview').attr('src', evt.target.result);
            $('#imagePreview').hide();
            $('#imagePreview').fadeIn(650);
        }

    });
});

//-----------------------Upload pictures-----------------------------------

//-----------------------verification-----------------------------------



