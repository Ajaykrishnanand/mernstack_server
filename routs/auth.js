import express from "express";
const router = express.Router();
import {isAdmin, requireSignins} from "../middewares"
// controllers
import {register,login,currentUser,forgotPassword,profileUpdate,findPeople,userFollow,addfollower,userFollowing,removeFollower, userUnfollow, searchUser,getUser} from "../controller/auth";

router.post("/register",register);
router.post("/login",login);
router.get("/current-user",requireSignins,currentUser);
router.post("/forget-password",forgotPassword);
router.put("/profile-update",requireSignins,profileUpdate);
router.get("/find-people",requireSignins,findPeople);
router.put("/user-follow",requireSignins,addfollower,userFollow);
router.get("/user-following",requireSignins,userFollowing);
router.put("/user-unfollow",requireSignins,removeFollower,userUnfollow);
router.get("/search-user/:query",searchUser);
router.get("/user/:username",getUser);
router.get("/current-admin",requireSignins,isAdmin,currentUser)
module.exports =router;
