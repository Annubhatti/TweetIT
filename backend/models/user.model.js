const mongoose = require("mongoose");

const socialUserSchema = new mongoose.Schema(
  {
    avatarUrl: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userAt: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SocialUser",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SocialUser",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SocialPosts",
      },
    ],
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SocialPosts",
      },
    ],
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SocialPosts",
      },
    ],
  },
  { timestamps: true }
);

const SocialUser = mongoose.model("SocialUser", socialUserSchema);

module.exports = SocialUser;