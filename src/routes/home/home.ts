//check if server is running on localhost
fetch("http://localhost:14400")
.then((response) => {
  if (response.status === 200) {
    window.location.href = "http://localhost:14400";
  }
})
.catch((error) => {
  console.log("Server is not running on localhost");
  window.location.href = "https://codeclimbers.io/install";
});