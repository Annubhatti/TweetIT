import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const readUser = createAsyncThunk("readUser", async () => {
  try {
    const res = await fetch(
      "https://tweet-it-backend-topaz.vercel.app/api/users/user/id/66e183147b64fafc1e2fa38a"
    );

    if (!res.ok) {
      console.log("Failed to get user");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
});
export const editUser = createAsyncThunk("editUser", async ({ userData }) => {
  try {
    const res = await fetch(
      "https://tweet-it-backend-topaz.vercel.app/api/users/user/edit/66e183147b64fafc1e2fa38a",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    if (!res.ok) {
      console.log("Failed to get user");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    error: null,
    status: "pending",
  },
  reducers: {
    userLike: (state, action) => {
      const posts = [...state.user.likedPosts, action.payload];
      return {
        ...state,
        user: { ...state.user, likedPosts: posts },
      };
    },
    userDisLike: (state, action) => {
      const posts = state.user.likedPosts.filter(
        (post) => post !== action.payload
      );
      return {
        ...state,
        user: { ...state.user, likedPosts: posts },
      };
    },
    removeUserBookmark: (state, action) => {
      const bookmarks = state.user.bookmarks.filter(
        (post) => post !== action.payload
      );
      return {
        ...state,
        user: { ...state.user, bookmarks: bookmarks },
      };
    },
    addUserBookmark: (state, action) => {
      const bookmarks = [...state.user.bookmarks, action.payload];
      return {
        ...state,
        user: { ...state.user, bookmarks: bookmarks },
      };
    },
    editUserProfile: (state, action) => {
      return {
        ...state,
        user: action.payload,
      };
    },
    followUser: (state, action) => {
      state.user.following.push(action.payload.followUser);
    },
    unfollowUser: (state, action) => {
      const following = state.user.following.filter(
        (user) => user !== action.payload.followUser
      );
      state.user.following = following;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(readUser.pending, (state, action) => {
      state.status = "pending";
    });
    builder.addCase(readUser.fulfilled, (state, action) => {
      state.status = "Success";

      state.user = action.payload;
    });
    builder.addCase(readUser.rejected, (state, action) => {
      state.status = "Failed";
    });
    builder.addCase(editUser.pending, (state, action) => {
      state.status = "pending";
    });
    builder.addCase(editUser.fulfilled, (state, action) => {
      state.status = "Success";
    });
    builder.addCase(editUser.rejected, (state, action) => {
      state.status = "Failed";
    });
  },
});

export const {
  userDisLike,
  userLike,
  addUserBookmark,
  removeUserBookmark,
  editUserProfile,
  followUser,
  unfollowUser,
} = userSlice.actions;
export default userSlice.reducer;