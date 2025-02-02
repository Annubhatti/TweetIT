import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchAllPosts = createAsyncThunk("allPosts", async () => {
  try {
    const res = await fetch("https://tweet-it-backend.vercel.app/api/posts");
    if (!res.ok) {
      console.log("Failed to fetch posts");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
});

const posts = createSlice({
  name: "allPosts",
  initialState: {
    posts: [],
    status: "idle",
    error: null,
  },
  reducers: {
    explorePostLike: (state, action) => {
      const index = state.posts.findIndex(
        (post) => post._id === action.payload.postId
      );
      const count = state.posts[index].likesCount + 1;
      const likes = [...state.posts[index].likes, action.payload.userId];
      state.posts[index] = {
        ...state.posts[index],
        likesCount: count,
        likes: likes,
      };
    },
    explorePostDislike: (state, action) => {
      const index = state.posts.findIndex(
        (post) => post._id === action.payload.postId
      );
      const count = state.posts[index].likesCount - 1;
      const likes = state.posts[index].likes.filter(
        (user) => user.toString() !== action.payload.userId
      );
      state.posts[index] = {
        ...state.posts[index],
        likesCount: count,
        likes: likes,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllPosts.pending, (state, action) => {
      state.status = "Loading";
    });
    builder.addCase(fetchAllPosts.fulfilled, (state, action) => {
      state.status = "Success";

      state.posts = action.payload;
    });
    builder.addCase(fetchAllPosts.rejected, (state, action) => {
      state.status = "Failed";
    });
  },
});

export const { explorePostDislike, explorePostLike } = posts.actions;
export default posts.reducer;
