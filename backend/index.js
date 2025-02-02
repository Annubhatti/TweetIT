const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./db/db.connection");
const SocialPosts = require("./models/post.model");
const SocialUser = require("./models/user.model");

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));

initializeDatabase();

const getPosts = async () => {
  try {
    const posts = await SocialPosts.find().populate("user");
    return posts;
  } catch (error) {
    console.log(error);
  }
};

app.get("/api/posts", async (req, res) => {
  try {
    const posts = await getPosts();

    if (posts && posts.length > 0) {
      res.json(posts);
    } else {
      res.status(404).json({ error: `Posts not found` });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to get posts error: ${error}` });
  }
});

const addPost = async (userId, post) => {
  try {
    const user = await SocialUser.findById(userId);

    const newPost = new SocialPosts({
      ...post,
      user: user._id,
    });
    const savedPost = await newPost.save();

    user.posts.push(savedPost._id);
    user.save();

    return savedPost;
  } catch (error) {
    console.log(error);
  }
};

app.post("/api/user/post", async (req, res) => {
  try {
    const post = await addPost(req.body.userId, req.body.post);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: `Post not found` });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to add post error: ${error}` });
  }
});

const getPostById = async (id) => {
  try {
    const post = await SocialPosts.findById(id).populate("user");
    return post;
  } catch (error) {
    console.log(error);
  }
};

app.get("/api/posts/:postId", async (req, res) => {
  try {
    const post = await getPostById(req.params.postId);

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: `Post not found` });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to get post error: ${error}` });
  }
});

const editPost = async (data, id) => {
  try {
    const post = await SocialPosts.findByIdAndUpdate(id, data, { new: true });

    return post;
  } catch (error) {
    console.log(error);
  }
};

app.post("/api/posts/edit/:postId", async (req, res) => {
  try {
    const post = await editPost(req.body, req.params.postId);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: `Post not found` });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to edit post error: ${error}` });
  }
});

const likePost = async (postId, userId) => {
  try {
    const post = await SocialPosts.findById(postId);
    post.likesCount = post.likesCount + 1;
    await post.save();

    post.likes.push(userId);
    await post.save();

    const user = await SocialUser.findById(userId);
    user.likedPosts.push(postId);
    await user.save();

    return post;
  } catch (error) {
    console.log(error);
  }
};

app.post("/api/posts/like/:postId", async (req, res) => {
  try {
    const post = await likePost(req.params.postId, req.body.userId);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: `Post not found` });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to like a post error: ${error}` });
  }
});

const dislikePost = async (postId, userId) => {
  try {
    const post = await SocialPosts.findById(postId);
    if (post.likesCount > 0) {
      const minus = post.likesCount - 1;
      post.likesCount = minus;
      await post.save();
    }
    post.likes = [...post.likes].filter((id) => id.toString() !== userId);
    await post.save();

    const user = await SocialUser.findById(userId);
    user.likedPosts = [...user.likedPosts].filter(
      (id) => id.toString() !== postId
    );
    await user.save();

    return post;
  } catch (error) {
    console.log(error);
  }
};

app.post("/api/posts/dislike/:postId", async (req, res) => {
  try {
    const post = await dislikePost(req.params.postId, req.body.userId);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: `Post not found` });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to dislike a post error: ${error}` });
  }
});

const deletePost = async (postId, userId) => {
  try {
    const user = await SocialUser.findById(userId);
    user.posts = [...user.posts].filter((id) => id.toString() !== postId);
    user.bookmarks = [...user.bookmarks].filter(
      (id) => id.toString() !== postId
    );
    user.likedPosts = [...user.likedPosts].filter(
      (id) => id.toString() !== postId
    );

    await user.save();

    const post = await SocialPosts.findByIdAndDelete(postId);
    return post;
  } catch (error) {
    console.log(error);
  }
};

app.delete("/api/user/posts/:postId", async (req, res) => {
  try {
    const post = await deletePost(req.params.postId, req.body.userId);

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: `Post not found` });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to delete post error: ${error}` });
  }
});

const addToUserBookmarks = async (userId, postId) => {
  try {
    const user = await SocialUser.findById(userId);
    user.bookmarks.push(postId);
    await user.save();
    return user.bookmarks;
  } catch (error) {
    console.log(error);
  }
};

app.post("/api/users/bookmark/:postId/", async (req, res) => {
  try {
    const post = await addToUserBookmarks(req.body.userId, req.params.postId);

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: `Post not found` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to bookmark a post error: ${error}` });
  }
});

const getUserBookmarks = async (userId) => {
  try {
    const user = await SocialUser.findById(userId).populate("bookmarks");
    const bookmarks = await Promise.all(
      user.bookmarks.map((post) => post.populate("user"))
    );

    return bookmarks;
  } catch (error) {
    console.log(error);
  }
};

app.get("/api/users/bookmark/:userId", async (req, res) => {
  try {
    const bookmarks = await getUserBookmarks(req.params.userId);

    if (bookmarks) {
      res.json(bookmarks);
    } else {
      res.status(404).json({ error: `bookmarks not found` });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to get bookmarks error: ${error}` });
  }
});

const removeUserBookmark = async (userId, postId) => {
  try {
    const user = await SocialUser.findById(userId);
    user.bookmarks = [...user.bookmarks].filter(
      (id) => id.toString() !== postId
    );
    await user.save();
    return user.bookmarks;
  } catch (error) {
    console.log(error);
  }
};

app.post("/api/users/remove-bookmark/:postId", async (req, res) => {
  try {
    const bookmarks = await removeUserBookmark(
      req.body.userId,
      req.params.postId
    );

    if (bookmarks) {
      res.json(bookmarks);
    } else {
      res.status(404).json({ error: `bookmark not found` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to remove bookmark error: ${error}` });
  }
});

const getAllUsers = async () => {
  try {
    const users = await SocialUser.find();
    return users;
  } catch (error) {
    console.log(error);
  }
};

app.get("/api/users", async (req, res) => {
  try {
    const users = await getAllUsers();

    if (users && users.length > 0) {
      res.json(users);
    } else {
      res.status(404).json({ error: `users not found` });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to get users error: ${error}` });
  }
});

const addUsers = async (usersData) => {
  try {
    const users = [];
    for (let i = 0; i < usersData.length; i++) {
      const newUser = new SocialUser(usersData[i]);
      const savedUser = await newUser.save();
      users.push(savedUser);
    }
    return users;
  } catch (error) {
    console.log(error);
  }
};

app.post("/api/users", async (req, res) => {
  try {
    const users = await addUsers(req.body);

    if (users && users.length > 0) {
      res.json(users);
    } else {
      res.status(404).json({ error: `users not found` });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to get users error: ${error}` });
  }
});

const followUser = async (userId, followUserId) => {
  try {
    const user = await SocialUser.findById(userId);
    user.following.push(followUserId);
    await user.save();

    const followUser = await SocialUser.findById(followUserId);
    followUser.followers.push(userId);
    await followUser.save();

    return user.following;
  } catch (error) {
    console.log(error);
  }
};

app.post("/api/users/follow/:followUserId", async (req, res) => {
  try {
    const user = await followUser(req.body.userId, req.params.followUserId);

    if (user && user.length > 0) {
      res.json(user);
    } else {
      res.status(404).json({ error: `user not found` });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to follow user error: ${error}` });
  }
});

const unFollowUser = async (userId, followUserId) => {
  try {
    const user = await SocialUser.findById(userId);
    user.following = [...user.following].filter(
      (id) => followUserId.toString() !== id.toString()
    );
    await user.save();

    const followUser = await SocialUser.findById(followUserId);
    followUser.followers = [...followUser.following].filter(
      (id) => followUserId.toString() !== id.toString()
    );
    await followUser.save();

    return user.following;
  } catch (error) {
    console.log(error);
  }
};

app.post("/api/users/unfollow/:followUserId", async (req, res) => {
  try {
    const user = await unFollowUser(req.body.userId, req.params.followUserId);

    if (user && user.length > 0) {
      res.json(user);
    } else {
      res.status(404).json({ error: `user not found` });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to follow user error: ${error}` });
  }
});

const getUserPosts = async (userId) => {
  try {
    const user = await SocialUser.findById(userId).populate("posts");
    const posts = await Promise.all(
      user.posts.map((post) => post.populate("user"))
    );

    return posts;
  } catch (error) {
    console.log(error);
  }
};

app.get("/api/users/user/posts/:userId", async (req, res) => {
  try {
    const posts = await getUserPosts(req.params.userId);

    if (posts && posts.length > 0) {
      res.json(posts);
    } else {
      res.status(404).json({ error: `posts not found` });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to get posts error: ${error}` });
  }
});

const getUserById = async (userId) => {
  try {
    const user = await SocialUser.findById(userId);
    return user;
  } catch (error) {
    console.log(error);
  }
};

app.get("/api/users/user/id/:userId", async (req, res) => {
  try {
    const user = await getUserById(req.params.userId);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: `user not found` });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to get user error: ${error}` });
  }
});

const editUser = async (userId, data) => {
  try {
    const user = await SocialUser.findByIdAndUpdate(userId, data, {
      new: true,
    });
    return user;
  } catch (error) {
    console.log(user);
  }
};

app.post("/api/users/user/edit/:userId", async (req, res) => {
  try {
    const user = await editUser(req.params.userId, req.body);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: `user not found` });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to update user error: ${error}` });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server Running on PORT: ${PORT}`);
});