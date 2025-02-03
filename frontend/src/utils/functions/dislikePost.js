export const dislikeAPost = async (id, userId) => {
  try {
    const res = await fetch(
      `tweet-it-backend-topaz.vercel.app/api/posts/dislike/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
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
};
