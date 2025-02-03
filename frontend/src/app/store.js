import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../pages/Profile/userSlice";
import otherUserReducer from "../pages/Profile/features/otherUserSlice";
import postReducer from "../pages/Home/features/userPostSlice";
import allPostsReducer from "../pages/Explore/postsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    otherUser: otherUserReducer,
    posts: postReducer,
    allPosts: allPostsReducer,
  },
});

export default store;
