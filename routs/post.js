import express from "express";
import formidable from "express-formidable";

// import ExpressFormidable from "express-formidable";
const router = express.Router();
import { requireSignins,canEditDeletePost, isAdmin } from "../middewares/index";
// controllers
import {
  createPost,
  uploadImage,
  postbyUser,
  userPost,
  updatePost,
  deletePost,
  newsFeed,
  unLikepost,
  Likepost,
 addComment,
 removeComment,
 totalPost,
 posts,
 getPost
} from "../controller/post";

router.post("/create-post", requireSignins, createPost);
router.post(
  "/upload-image",
  requireSignins,
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  uploadImage
);
router.get("/user-posts", requireSignins, postbyUser);
router.get("/user-post/:_id", requireSignins, userPost);
router.put("/update-post/:_id", requireSignins, canEditDeletePost,updatePost);
router.delete("/delete-post/:_id",requireSignins,canEditDeletePost,deletePost);
router.get("/news-feed/:page",requireSignins,newsFeed);
router.put("/like-post",requireSignins,Likepost);
router.put("/unlike-post",requireSignins,unLikepost);
router.put("/add-comment",requireSignins,addComment);
router.put("/remove-comment",requireSignins,removeComment);
router.get("/total-posts",totalPost);
router.get("/posts",posts);
router.get("/post/:_id",getPost);
router.delete("/admin/delete-post/:_id",requireSignins,isAdmin,deletePost)
module.exports = router;
