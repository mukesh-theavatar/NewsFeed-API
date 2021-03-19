
const express = require("express");
const auth = require("../middleware/authorization");
const router = express.Router();

const userControllers = require("../controllers/user_controllers")


router.post('/signup', userControllers.signup);

router.post('/login', userControllers.login);


router.get('/auth', auth , (req, res) => {
    try{
        res.json({"user":req.profile , "msg":"In Protected Route"});
    }
    catch(err){
        res.send(err);
    }
});

router.post('/follow', auth , userControllers.follow);

module.exports = router;