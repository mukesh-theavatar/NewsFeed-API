
const User = require("../models/user");

exports.signup = async(req,res) =>
{
    try {
        const user = new User(req.body)
        const gentoken = await user.getAuthToken();
        await user.save();
        // console.log(user);
        res.status(201).json({
            message:"User Created",
            user : user,
            token:gentoken
        })
    } catch (error) {
        res.send(error.message);
    }    
}


exports.login = async(req,res) =>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findByCredentials(email,password);
        console.log("In Login:",user)
        const token = await user.getAuthToken()
        res.json({
            message:"Login Successful",
            user:user,
            token:token
        })
    } 
    catch (error) {
        res.json({
            message:error.message
        });
    }
}

exports.follow = async (req,res) =>{
    try {
        const user = req.profile;
        const to_follow = req.body.username;
        const user_to_follow = await User.findOne({username:to_follow});
        const arr = user.following;
        var i = 0;
        var flag = 0;
        while(i<arr.length)
        {
            if(arr[i]==String(user_to_follow._id))
            {
                res.send("Already Following " + to_follow)
                flag++;
                break;
            }
            i++;
        }
        if(flag==0)
        {
            if(!user_to_follow)
            {
                res.send("No User Found");
            }
            user_to_follow.followers.push(user._id);
            user.following.push(user_to_follow._id);
            user.save();
            user_to_follow.save();
            res.send(`Following ${req.body.username}`)
        }
    } catch (error) {
        res.send(error.message);
    }
}