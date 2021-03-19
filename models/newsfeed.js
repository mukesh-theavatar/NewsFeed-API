
const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const User = require("./user");

const storySchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    count:{
        type:Number
    },
    viewedby:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:User
    }],
});
storySchema.plugin(timestamps);
const Story = mongoose.model("Story",storySchema);
module.exports = Story;
