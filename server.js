// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const app = require("./app");
app.listen(8000, () => {
  console.log("listening on port 8000");
});