export const getPosts = async (id) => {
  try {
    if (id) {
      const res = await fetch(
        `https://tweet-it-backend-topaz.vercel.app/api/users/user/posts/${id}`
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
};
