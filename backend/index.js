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

// Initialize Database
initializeDatabase();

// // ✅ Sample Data Setup Route
// app.get("/api/setup", async (req, res) => {
//   try {
//     // 🗑️ Clear existing data
//     await SocialUser.deleteMany({});
//     await SocialPosts.deleteMany({});

//     console.log("✅ Previous data deleted");

//     // 👤 Create sample users
//     const user1 = new SocialUser({
//       userName: "John Doe",
//       userAt: "johndoe",
//       bio: "Software Engineer & Tech Enthusiast.",
//       avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
//       followers: [],
//       following: [],
//       posts: [],
//       bookmarks: [],
//       likedPosts: []
//     });

//     const user2 = new SocialUser({
//       userName: "Jane Doe",
//       userAt: "janedoe",
//       bio: "Passionate about AI & Web Development.",
//       avatarUrl: "https://randomuser.me/api/portraits/women/2.jpg",
//       followers: [],
//       following: [],
//       posts: [],
//       bookmarks: [],
//       likedPosts: []
//     });

//     const savedUser1 = await user1.save();
//     const savedUser2 = await user2.save();

//     console.log("✅ Users added:", savedUser1.userName, savedUser2.userName);

//     // 📝 Create sample posts
//     const post1 = new SocialPosts({
//       user: savedUser1._id,
//       description: "Hello, this is my first post!",
//       imageUrl: "https://source.unsplash.com/random/300×300",
//       videoUrl: "",
//       gifUrl: "",
//       likesCount: 0,
//       likes: [],
//       comments: []
//     });

//     const post2 = new SocialPosts({
//       user: savedUser2._id,
//       description: "Excited to be here!",
//       imageUrl: "",
//       videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
//       gifUrl: "",
//       likesCount: 1,
//       likes: [savedUser1._id],
//       comments: [
//         {
//           user: savedUser1._id,
//           comment: "Welcome to the community!"
//         }
//       ]
//     });

//     const savedPost1 = await post1.save();
//     const savedPost2 = await post2.save();

//     console.log("✅ Posts added:", savedPost1.description, savedPost2.description);

//     // Link posts to users
//     savedUser1.posts.push(savedPost1._id);
//     savedUser2.posts.push(savedPost2._id);
//     await savedUser1.save();
//     await savedUser2.save();

//     res.json({ message: "🎉 Sample data added successfully!" });
//   } catch (error) {
//     console.error("❌ Error setting up sample data:", error.message);
//     res.status(500).json({ error: `Error setting up data: ${error.message}` });
//   }
// });

// ✅ Fetch all posts
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

// ✅ Add a new post
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

// ✅ Fetch a post by ID
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

// ✅ Like a post
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

// ✅ Delete a post
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

// ✅ Fetch all users
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

// ✅ Fetch user by ID
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

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server Running on PORT: ${PORT}`);
});
