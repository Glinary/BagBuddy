Swal.fire({
  position: "center",
  icon: "error",
  title: "Page does not exist",
  text: "go back to main page?",
  showConfirmButton: true,
}).then((result) => {
  if (result.isConfirmed) {
    console.log("User confirmed!");
    window.location.href = "/home";
  }
});
