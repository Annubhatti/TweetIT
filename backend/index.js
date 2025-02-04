require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./db/db.connection");
const SocialPosts = require("./models/post.model");
const SocialUser = require("./models/user.model");

const app = express();

// CORS Configuration
const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));

initializeDatabase();

app.get("/", (req, res)=>{
  res.send("This is Tweet App")
})

app.get("/api/posts", async (req, res) => {
  try {
    const posts = await SocialPosts.find().populate("user");
    if (posts.length > 0) {
      res.json(posts);
    } else {
      res.status(404).json({ error: "Posts not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to get posts: ${error.message}` });
  }
});


app.post("/api/user/post", async (req, res) => {
  try {
    const user = await SocialUser.findById(req.body.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newPost = new SocialPosts({ ...req.body.post, user: user._id });
    const savedPost = await newPost.save();

    user.posts.push(savedPost._id);
    await user.save();

    res.json(savedPost);
  } catch (error) {
    res.status(500).json({ error: `Error adding post: ${error.message}` });
  }
});


app.get("/api/posts/:postId", async (req, res) => {
  try {
    const post = await SocialPosts.findById(req.params.postId).populate("user");
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to get post: ${error.message}` });
  }
});


app.post("/api/posts/like/:postId", async (req, res) => {
  try {
    const post = await SocialPosts.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.likesCount += 1;
    post.likes.push(req.body.userId);
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: `Error liking post: ${error.message}` });
  }
});


app.delete("/api/user/posts/:postId", async (req, res) => {
  try {
    const post = await SocialPosts.findByIdAndDelete(req.params.postId);
    if (post) {
      res.json({ message: "Post deleted successfully" });
    } else {
      res.status(404).json({ error: "Failed to delete post" });
    }
  } catch (error) {
    res.status(500).json({ error: `Error deleting post: ${error.message}` });
  }
});


app.get("/api/users", async (req, res) => {
  try {
    const users = await SocialUser.find();
    if (users.length > 0) {
      res.json(users);
    } else {
      res.status(404).json({ error: "Users not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Error fetching users: ${error.message}` });
  }
});


app.get("/api/users/:userId", async (req, res) => {
  try {
    const user = await SocialUser.findById(req.params.userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to get user: ${error.message}` });
  }
});

app.put("/api/users/:userId", async (req, res) => {
  try {
    const updatedUser = await SocialUser.findByIdAndUpdate(
      req.params.userId,
      { $set: req.body }, // Update all fields sent in request
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: `Failed to update user: ${error.message}` });
  }
});


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Running on PORT: ${PORT}`);
});
