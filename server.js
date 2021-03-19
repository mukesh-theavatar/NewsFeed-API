const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
const port = process.env.PORT;
// const uuid = require("uuid").v4();

const multer = require("multer");

const storageA = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("in storage:", file);
    if (file.mimetype == "image/jpeg") {
      const uuid = require("uuid").v4();
      const name = uuid + file.originalname;
      file.originalname = name;
      console.log(file);
      cb(null, "./uploads/images");
    } else cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    console.log("In Filename:", file);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storageA });

const user_routes = require("./routes/user");
const story_routes = require("./routes/story");

require("./Database/database");

app.use(morgan("dev"));
app.use(bodyParser.json());

app.use(user_routes);
app.use(upload.single("file"));
app.use(story_routes);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

// const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
// const ffmpeg = require('fluent-ffmpeg');
// ffmpeg.setFfmpegPath(ffmpegPath);

// const multer = require("multer");

// const storageA = multer.diskStorage({
//     destination: function (req, file, cb) {
//     cb(null, './uploads/')
//     },
//     filename: function (req, file, cb) {
//         console.log("In Filename:",file);
//         cb(null,file.originalname);
//     }
// });

// const upload = multer({storage:storageA})

// app.post('/upload', upload.single("image") ,(req, res) => {
//     ffmpeg('./uploads/' + req.file.originalname)
//     .setStartTime(req.body.start)
//     .setDuration(30)
//     .output(`./uploads/converted/new${req.file.originalname}`)
//     .on('end', function(err) {
//     if(!err)
//     {
//         res.send("successfully converted");
//     }
//     })
//     .on('error', function(err){
//         res.send(err.message)
//     }).run();
// });
