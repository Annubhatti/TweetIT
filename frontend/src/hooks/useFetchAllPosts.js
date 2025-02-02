import { useEffect, useState } from "react";

export const useFetchAllPosts = () => {
  const [allPosts, setAllPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await fetch("https://tweet-it-backend.vercel.app/api/posts");
      if (!res.ok) {
        console.log("Failed to fetch posts");
      }

      const data = await res.json();
      setAllPosts(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return allPosts;
};
