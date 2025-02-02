import { useEffect, useState } from "react";

export const useFetchUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`https://tweet-it-backend.vercel.app/api/users`);

      if (!res.ok) {
        console.log("Failed to get user");
      }

      const data = await res.json();
      if (data) {
        setUsers(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return users;
};
