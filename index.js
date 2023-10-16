// Imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");

//Init app
const app = express();

// Enable cors
app.use(cors());

// Static file server
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(
    "Exercise Tracker Microservice is listening on port " +
      listener.address().port
  );
});
