
const mongoose = require('mongoose');
const url = process.env.DB_URL

//Connecting the MongoDB Database
mongoose
  .connect("mongodb://localhost:27017/soal-db", {
    useNewParser: true,
    useUnifiedTopology: true,
    userCreateIndex: true,
  })
  .then(() => {
    console.log("MongoDB CONNECTED");
  })
  .catch((error) => {
    console.log(error);
  });


