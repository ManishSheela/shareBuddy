
require("dotenv").config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require('./config/db.js');
const path = require('path');
connectDB();

app.use(express.static('public'));

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