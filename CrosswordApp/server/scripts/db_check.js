const mongoose = require('mongoose');

const uri = "mongodb://127.0.0.1:27017/crossword_db";
console.log("Testing connection to:", uri);

mongoose.connect(uri)
    .then(() => {
        console.log("Connected successfully!");
        process.exit(0);
    })
    .catch(err => {
        console.error("Connection failed:", err.message);
        process.exit(1);
    });
