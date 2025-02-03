import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const readOtherUser = createAsyncThunk(
  "readOtherUser",
  async (userId) => {
    try {
      if (userId) {
        const res = await fetch(
          `https://tweet-it-backend-topaz.vercel.app/api/users/user/id/${userId}`
        );

        if (!res.ok) {
          console.log("Failed to get user");
        }

        const data = await res.json();
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

const otherUserSlice = createSlice({
  name: "otherUser",
  initialState: {
    otherUser: {},
    error: null,
    status: "idle",
  },
  reducers: {
    getUser: (state, action) => {
      return state.otherUser;
    },
    followed: (state, action) => {
      state.otherUser.followers?.push(action.payload);
    },
    unfollowed: (state, action) => {
      state.otherUser.followers = state.otherUser?.followers?.filter(
        (followerId) => followerId !== action.payload
      );
    },
  },

  extraReducers: (builder) => {
    builder.addCase(readOtherUser.pending, (state, action) => {
      state.status = "pending";
    });
    builder.addCase(readOtherUser.fulfilled, (state, action) => {
      state.status = "Success";

      state.otherUser = action.payload;
    });
    builder.addCase(readOtherUser.rejected, (state, action) => {
      state.status = "Failed";
    });
  },
});

export const { followed, unfollowed, getUser } = otherUserSlice.actions;
export default otherUserSlice.reducer;
