export const follow = async ({ followUserId, userId }) => {
  try {
    const res = await fetch(
      `https://tweet-it-kappa.vercel.app/api/users/follow/${followUserId}`,
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
