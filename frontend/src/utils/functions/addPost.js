export const addPost = async (data) => {
  try {
    const res = await fetch(
      `https://tweet-it-kappa.vercel.app/api/user/post`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const resData = await res.json();
    return resData;
  } catch (error) {
    console.log(error);
  }
};
