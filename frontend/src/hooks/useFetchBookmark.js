import { useEffect, useState } from "react";

export const useFetchBookmark = (id, bookmarks) => {
  const [bookmark, setBookmark] = useState([]);

  const fetchBookmark = async () => {
    try {
      if (id) {
        const res = await fetch(
          `https://tweet-it-backend.vercel.app/api/users/bookmark/${id}`
        );

        if (!res.ok) {
          console.log("Failed to get user");
        }

        const data = await res.json();
        if (data) {
          setBookmark(data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBookmark(id);
  }, [id, bookmarks]);

  return bookmark;
};
