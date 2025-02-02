import { useEffect, useState } from "react";

export const useGetPosts = (userId) => {
  const [posts, setPosts] = useState([]);

  const getPosts = async (id) => {
    try {
      if (id) {
        const res = await fetch(
          `https://tweet-it-backend.vercel.app/api/users/user/posts/${id}`
        );

        if (!res.ok) {
          console.log("Failed to get user");
        }

        const data = await res.json();
        if (data) {
          setPosts(data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) {
      getPosts(userId);
    }
  }, [userId]);

  return posts;
};
