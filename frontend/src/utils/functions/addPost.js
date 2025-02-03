export const addPost = async (data) => {
  const API_URL = "https://tweet-it-backend-topaz.vercel.app/api/user/post"; // Ensure HTTPS is used

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to add post.");
    }

    return await res.json();
  } catch (error) {
    console.error("Error in addPost:", error.message);
    return { success: false, error: error.message };
  }
};
