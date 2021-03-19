const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const auth = async(req,res,next) => {
    try {
        if(!req.header("Authorization"))
        {
            throw new Error("Token Required")
        }
        const token = req.header("Authorization").replace("Bearer ","");
        console.log(token);
        const user_with_token =  jwt.verify(token,process.env.JWT_SECRET);
        const name_found = user_with_token.name;
        const user = User.findOne({name:name_found}).exec()
        user.then((user) =>{
            if(!user){
                throw new Error("Authorization Failed");
            }
            else{
                console.log(user);
                req.profile = user;
                next();
            }
        });
    } catch (error) {
        res.send(error.message);
    }
}

module.exports = auth;