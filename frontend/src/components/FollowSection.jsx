import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useFetchUsers } from "../hooks/useFetchUsers";
import { useDispatch, useSelector } from "react-redux";
import { followUser, readUser, unfollowUser } from "../pages/Profile/userSlice";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { follow } from "../utils/functions/follow";
import { followed, readOtherUser, unfollowed } from "../pages/Profile/features/otherUserSlice";
import { unFollow } from "../utils/functions/unfollow";

const FollowSection = () => {
  const [text, setText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const { users, error, loading } = useFetchUsers();
  const dispatch = useDispatch();
  const mainUser = useSelector((state) => state.user.user);
  const mainUserId = mainUser?._id;

  useEffect(() => {
    if (Array.isArray(users) && users.length > 0 && mainUserId) {
      setFilteredUsers(users.filter((user) => user._id !== mainUserId));
    }
  }, [users, mainUserId]);

  useEffect(() => {
    if (!text.trim()) {
      setFilteredUsers(Array.isArray(users) ? users.filter((user) => user._id !== mainUserId) : []);
      return;
    }
    setFilteredUsers(
      Array.isArray(users)
        ? users.filter(
            (user) =>
              user._id !== mainUserId &&
              (user.userName.toLowerCase().includes(text.toLowerCase()) ||
                user.userAt.toLowerCase().includes(text.toLowerCase()))
          )
        : []
    );
  }, [text, users, mainUserId]);

  // ✅ Follow User Function (Fix)
  const followHandler = async (user) => {
    if (!mainUserId) {
      toast.error("User not found");
      return;
    }
    try {
      await follow({ followUserId: user._id, userId: mainUserId });
      dispatch(readOtherUser(user._id));
      dispatch(followed(user._id));
      dispatch(followUser({ followUserId: user._id, userId: mainUserId }));
      toast.success("Following");
    } catch (error) {
      toast.error("Failed to follow user");
    }
  };

  // ✅ Unfollow User Function (Fix)
  const unFollowHandler = async (user) => {
    if (!mainUserId) {
      toast.error("User not found");
      return;
    }
    try {
      await unFollow({ followUserId: user._id, userId: mainUserId });
      dispatch(readOtherUser(user._id));
      dispatch(unfollowed(user._id));
      dispatch(unfollowUser({ followUserId: user._id, userId: mainUserId }));
      toast.success("Unfollowed");
    } catch (error) {
      toast.error("Failed to unfollow user");
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="p-3">
      <div className="d-flex px-2 py-1 rounded-2" style={{ backgroundColor: "white" }}>
        <FiSearch style={{ fontSize: "25px", marginTop: "5px" }} />
        <input
          className="form-control mx-1 border-0 bg-transparent"
          placeholder="Search"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <p className="fw-semibold text-center mb-0 mt-3">Who to follow?</p>
      <div className="card mt-1 mb-3">
        <div className="card-body">
          {filteredUsers.length === 0 ? (
            <p className="text-center fw-semibold my-3 text-secondary">No users found</p>
          ) : (
            filteredUsers.map((user) => (
              <div key={user._id} className="d-flex justify-content-between my-3 align-content-center">
                <Link to={`/user-profile/${user._id}`} state={{ user }}>
                  <img
                    src={user.avatarUrl || "https://via.placeholder.com/50"}
                    alt={user.userName}
                    style={{ height: "40px", width: "40px", borderRadius: "100%" }}
                  />
                </Link>
                <span className="px-2 fw-semibold mt-1">{user.userName.slice(0, 7)}...</span>
                {mainUser?.following?.includes(user._id) ? (
                  <small onClick={() => unFollowHandler(user)} className="fw-semibold text-secondary mt-1" style={{ cursor: "pointer" }}>Unfollow</small>
                ) : (
                  <small onClick={() => followHandler(user)} className="fw-semibold text-secondary mt-1" style={{ cursor: "pointer" }}>Follow</small>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowSection;
