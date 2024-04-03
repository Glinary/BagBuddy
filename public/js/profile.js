// when user click the sign out button,
// it will send a request to the server to
// delete the session and redirect to the login page

document.getElementById("edit-profile-btn").addEventListener("click", function (event) {
  event.preventDefault();
  console.log("Editing profile...");

  window.location.href = "/editprofile";
});

document.getElementById("item-gallery-btn").addEventListener("click", function (event) {
  event.preventDefault();
  console.log("Viewing item gallery...");

  window.location.href = "/itemgallery/:id";
});


document.getElementById("signout-btn").addEventListener("click", async function (event) {
  event.preventDefault();
  console.log("Signing out...");

  try {
    await signOut();
  } catch (error) {
    console.error("Error signing out:", error);
  }
});

async function signOut() {
    const response = await fetch("/postSignout", {
        method: "POST",
    });
    
    if (response.status === 200) {
        window.location.href = "/login";
    } else {
        console.error("Failed to sign out.");
    }
}
