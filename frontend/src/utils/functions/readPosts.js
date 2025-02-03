export const readPosts = async (id) => {
  try {
    if (id) {
      const res = await fetch(
        `https://tweet-it-backend-topaz.vercel.app/api/users/user/posts/${id}`
      );

      if (!res.ok) {
        console.log("Failed to get posts");
      }

      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};
