import { useEffect, useState } from "react";

export const useSortPost = (filter, posts) => {
  const [filteredPosts, setFilteredPosts] = useState([]);

  const sortPost = () => {
    if (filter === "Latest") {
      const filtered = [...posts].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setFilteredPosts(filtered);
    } else if (filter === "Trending") {
      const filtered = [...posts].sort((a, b) => b.likesCount - a.likesCount);
      setFilteredPosts(filtered);
    }
  };

  useEffect(() => {
    if (filter) {
      sortPost();
    }
  }, [filter, posts]);

  return filteredPosts.length === 0 ? posts : filteredPosts;
};
