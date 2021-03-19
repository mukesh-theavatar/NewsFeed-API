
const router = require('express').Router();
const story = require("../controllers/story_controllers");
const auth = require("../middleware/authorization");

router.post('/uploadstory', auth ,  story.storyadd);

router.delete('/removeStory', auth , story.removeStory);

router.get('/getstories', auth ,  story.getall);

router.get("/viewstory", auth, story.view)

module.exports = router;
