const path = require("path");
const uuid = require("uuid").v4();
const fs = require("fs");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const Story = require("../models/newsfeed");

exports.storyadd = async (req, res) => {
  console.log("hello");
  console.log(req.file);
  console.log("../uploads/" + req.file.originalname);
  const name = uuid;
  const user = req.profile;
  console.log(user);
  if (req.file.mimetype == "video/mp4") {
    ffmpeg(req.file.path)
      .setStartTime(req.body.start)
      .setDuration(30)
      .output(
        `${req.file.destination}/converted/${name + req.file.originalname}`
      )
      .on("end", function (err) {
        if (!err) {
          const path = req.file.path;
          fs.unlink(path, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
          const db_name = name + req.file.originalname;
          console.log(db_name);
          const vid_story = new Story({
            title: db_name,
          });
          user.stories.concat(vid_story._id);
          user.save();
          // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",user.stories);
          vid_story.save();
          res.json({ message: "successfully uploaded" });
        }
      })
      .on("error", function (err) {
        res.send(err.message);
      })
      .run();
  } else if (req.file.mimetype == "image/jpeg") {
    const pic_story = new Story({
      title: req.file.originalname,
    });
    user.stories.push(pic_story._id);
    user.save();
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",user.stories);
    pic_story.save();
    console.log(user);
    res.json({ message: "Uploaded", Image: req.file });
  }
};

exports.removeStory = async (req, res) => {
  console.log(req.body.file);
  const name = req.body.file.split(".");
  console.log(name);
  const user = req.profile;
  const type = name[name.length - 1];
  if (type == "video" || type == "mp4") {
    const path1 = "/converted/" + req.body.file;
    fs.unlink(path.join("uploads/" + path1), (err) => {
      if (err) {
        console.error(err.message);
        return;
      }
    });
    const tofind = await Story.findOne({ title: req.body.file });
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n",tofind)
    // console.log(tofind._id);
    // console.log(`ObjectId("${tofind._id}")`);
    // console.log(user.stories);
    const index = user.stories.indexOf(tofind._id);
    const arr = user.stories;
    arr.splice(index, 1);
    user.stories = arr;
    // user.stories.slice(index,1);
    // console.log(index)
    // console.log(user);
    user.save();
    const deleted = Story.deleteOne({ title: req.body.file })
      .exec()
      .then((res) => console.log(res))
      .catch((err) => console.log(err.message));
    res.json({ message: "Deleted Successfully" });
  } else {
    const path1 = "/images/" + req.body.file;
    fs.unlink(path.join("uploads/" + path1), (err) => {
      if (err) {
        console.error(err.message);
        return;
      }
    });
    const tofind = await Story.findOne({ title: req.body.file });
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n",tofind)
    // console.log(tofind._id);
    // console.log(`ObjectId("${tofind._id}")`);
    // console.log(user.stories);
    const index = user.stories.indexOf(tofind._id);
    const arr = user.stories;
    arr.splice(index, 1);
    user.stories = arr;
    // user.stories.slice(index,1);
    // console.log(index)
    // console.log(user);
    user.save();
    const deleted = Story.deleteOne({ title: req.body.file })
      .exec()
      .then((res) => console.log(res))
      .catch((err) => console.log(err.message));
    res.json({ message: "Deleted Successfully" });
  }
};

exports.getall = async (req, res) => {
  try {
    const all_stories = await Story.find({}).sort({ createdAt: -1 });
    res.json({ stories: all_stories });
  } catch (error) {
    res.send(err.message);
  }
};

exports.view = async (req, res) => {
  try {
    // var flag = 0;
    const viewed = await Story.findOne({ _id: req.body.story_id });
    const user = req.profile;
    // console.log(user._id)
    // console.log(viewed.viewedby);
    // console.log(arr);
    const arr = viewed.viewedby;
    var i = 0;
    while (i < arr.length) {
      if (arr[i] == String(user._id)) {
        res.send("Already Viewed");
        break;
      }
      i++;
    }
    viewed.viewedby.push(user._id);
    const len = viewed.viewedby;
    viewed.count = len.length;
    viewed.save();
    res.json({ story: viewed });
  } catch (error) {
    res.send(error.message);
  }
};
