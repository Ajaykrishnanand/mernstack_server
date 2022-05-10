import User from "../models/user";
import { hashpassword, comparePassword } from "../helpers/auth";

import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";


export const register = async (req, res) => {
  const { name, email, password, secret } = req.body;
  if (!name) {
    return res.json({
      error: "Name is required",
    });
  }
  if (!email) {
    return res.json({
      error: "email is required",
    });
  }
  if (!password || password.length < 6) {
    return res.json({
      error: " password  should be 6 charactor long",
    });
  }
  if (!secret) {
    return res.json({
      error: "answer is required",
    });
  }
  const exist = await User.findOne({ email });
  if (exist) {
    return res.json({ error: "email is taken" });
  }
  const hashedpassword = await hashpassword(password);
  const user = new User({
    name,
    email,
    password: hashedpassword,
    secret,
    username: nanoid(6),
  });
  try {
    await user.save();
    console.log("ragistred user", user);
    return res.json({
      ok: true,
    });
  } catch (err) {
    console.log("register failer", err);
    return res.status(400).send("error,try.again");
  }
};

export const login = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "no user found",
      });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.json({
        error: "wrong password",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    user.password = undefined;
    user.secret = undefined;
    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send("error.try agian");
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

export const forgotPassword = async (req, res) => {
  const { email, newpassword, secret } = req.body;
  if (!newpassword || newpassword.length < 6) {
    return res.json({
      error: "New password is required and should be min 6 characters long",
    });
  }
  if (!secret) {
    return res.json({
      error: "secret is required",
    });
  }
  const user = await User.findOne({ email, secret });
  if (!user) {
    return res.json({
      error: "we can't verify you with those datails",
    });
  }
  try {
    const hashed = await hashpassword(newpassword);
    await User.findByIdAndUpdate(user._id, { password: hashed });
    return res.json({
      success: "congrats,now you can login your new password",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      error: "something wrong.try again.",
    });
  }
};

export const profileUpdate = async (req, res) => {
  try {
    //   console.log("profile update",req.body);
    const data = {};
    if (req.body.username) {
      data.username = req.body.username;
    }
    if (req.body.about) {
      data.about = req.body.about;
    }
    if (req.body.name) {
      data.name = req.body.name;
    }
    if (req.body.password) {
      if (req.body.password < 6) {
        return res.json({
          error: "password is required and should be 6 charector long",
        });
      } else {
        data.password = await hashpassword(req.body.password);
      }
    }
    if (req.body.password) {
      data.password = req.body.password;
    }
    if (req.body.secret) {
      data.secret = req.body.secret;
    }
    if (req.body.image) {
      data.image = req.body.image;
    }
    let user = await User.findByIdAndUpdate(req.user._id, data, { new: true });
    console.log("updated user", user);
    user.password = undefined;
    user.secret = undefined;
    res.json(user);
  } catch (err) {
    if (err.code == 11000) {
      return res.json({ error: "duplicate username" });
    }
    console.log(err);
  }
};
export const findPeople = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    //user.following
    let following = user.following;
    following.push(user._id);

    const people = await User.find({ _id: { $nin: following } })
      .select("-password -secret")
      .limit(10);

    res.json(people);
  } catch (err) {
    console.log(err);
  }
};
export const addfollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $addToSet: { followers: req.user._id },
    });
    next();
  } catch (err) {
    console.log(err);
  }
};
export const userFollow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { following: req.body._id },
      },
      { new: true }
    ).select("-password -secret");
    console.log(user);
    res.json(user);
    //  return res.json(user);
  } catch (err) {
    console.log(err);
  }
};

export const userFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const following = await User.find({ _id: user.following }).limit(100);
    res.json(following);
  } catch (err) {
    console.log(err);
  }
};
export const removeFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $pull: { followers: req.user._id }
    });
    next();
  } catch (err) {
    console.log(err);
  }
};
export const userUnfollow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body._id },
      },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};
export const searchUser = async (req,res)=>{
  const{query} = req.params;
  if(!query) return;
  try{
    const user = await User.find({
      $or:[
        {name:{$regex :query,$options: "i"}},
        {username:{$regex:query,$options:"i"}},
      ]
    }).select("-password -secret");
    res.json(user);
  }catch(err){
    console.log(err);
  }
}
export const getUser = async(req,res)=>{
  try{

    const  user = await User.findOne({username : req.params.username}).select(
      "-password -secret"
    );
    res.json(user);
  }catch(err){
    console.log(err);
  }
}