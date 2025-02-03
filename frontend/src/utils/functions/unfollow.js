export const unFollow = async ({ followUserId, userId }) => {
  try {
    const res = await fetch(
      `https://tweet-it-backend-topaz.vercel.app/api/users/unfollow/${followUserId}`,
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
