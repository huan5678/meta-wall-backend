const express = require("express");
const router = express.Router();
const Post = require("../models/post");
//資料全撈
router.get("/", async (req, res) => {
  res.status(200).json({
    status: "200",
    post: await Post.find()
  });
});
module.exports = router;
