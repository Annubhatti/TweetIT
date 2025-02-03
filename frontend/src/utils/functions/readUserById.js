export const readUserById = async (id) => {
  try {
    const res = await fetch(
      `tweet-it-backend-topaz.vercel.app/api/users/user/id/${id}`
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
