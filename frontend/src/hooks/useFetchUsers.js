import { useEffect, useState } from "react";

export const useFetchUsers = () => {
  const [users, setUsers] = useState([]); // Ensures users is always an array
  const [error, setError] = useState(null); // Track API errors
  const [loading, setLoading] = useState(true); // Track loading state

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://tweet-it-backend-topaz.vercel.app/api/users");

      if (!res.ok) {
        throw new Error(`API Error: ${res.status} - ${res.statusText}`);
      }

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []); // Ensure we always set an array
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError(error.message); // Store the error message
      setUsers([]); // Reset users to an empty array in case of an error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, error, loading };
};
