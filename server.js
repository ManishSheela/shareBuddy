
require("dotenv").config();

const express = require('express');
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const connectDB = require("./config/db.js");
const path = require("path");
connectDB();

app.use(express.static("public"));
// cors enable
// const corsOptions = {
//   // ["http://localhost:3000", "http://localhost:5000"],
//   origin: process.env.ALLOWED_CLIENTS.split(","),
// };

// app.use(cors(corsOptions));

app.use(function (req, res, next) {
  // Allow requests from any origin
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Allow specific HTTP methods
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

  // Allow specific headers
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Allow credentials (if needed)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Continue to the next middleware
  next();
});

// enable json 
app.use(express.json())
// template engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// routes
app.use('/api/files', require('./routes/files.js'));  // upload file on server and send email

app.use("/files", require("./routes/show.js")); // download file using copied path

app.use("/files/download", require("./routes/download.js")); // download actual file


app.listen(PORT, () => {
    console.log(`Listening on port ${ PORT }`);
})