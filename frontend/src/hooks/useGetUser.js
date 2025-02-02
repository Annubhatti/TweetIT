import { useEffect, useState } from "react";

export const useGetUser = (userId) => {
  const [user, setUser] = useState({});

  const fetchUser = async () => {
    try {
      if (userId) {
        const userRes = await fetch(
          `https://tweet-it-backend.vercel.app/api/users/user/id/${userId}`
        );
        const userData = await userRes.json();
        setUser(userData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  return user;
};
