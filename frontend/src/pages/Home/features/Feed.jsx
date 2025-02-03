import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FiSliders } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { readUser } from "../../Profile/userSlice";
import Post from "../../../components/Post";
import { readPosts } from "./userPostSlice";
import AddPost from "../../../components/AddPost";
import { Toaster } from "react-hot-toast";
import { useSortPost } from "../../../hooks/useSortPost"; // Import Hook

const Feed = () => {
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [filter, setFilter] = useState("");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const posts = useSelector((state) => state.posts.posts);
  const _id = user?._id; // Prevents error if user is undefined

  useEffect(() => {
    dispatch(readUser());
  }, [dispatch]);

  useEffect(() => {
    if (_id) {
      dispatch(readPosts(_id));
    }
  }, [_id, dispatch]);

  // ✅ Correct way to use the Hook
  const filteredPosts = useSortPost(filter, posts);

  return (
    <>
      <div className="position-relative mb-5">
        {/* Post Input Box */}
        <div
          onClick={() => setIsPostOpen(true)}
          className="my-3 py-2 px-3 d-flex rounded-3"
          style={{ backgroundColor: "white" }}
        >
          <img
            src={user?.avatarUrl || "https://via.placeholder.com/50"}
            style={{ height: "50px", width: "50px", borderRadius: "100%" }}
            alt="User Avatar"
          />
          <p className="m-0 px-4 fw-semibold" style={{ position: "relative", top: "13px" }}>
            What is happening?
          </p>
        </div>

        {isPostOpen && <AddPost setIsOpen={setIsPostOpen} />}

        {/* Filter Section */}
        <div className="position-relative" style={{ backgroundColor: "white" }}>
          <div className="d-flex justify-content-between my-4 px-3 py-2">
            <p className="m-0 fw-semibold">{filter || "All"} Posts</p>
            <span onClick={() => setIsFilter((prev) => !prev)}>
              <FiSliders />
            </span>
          </div>
          {isFilter && (
            <div className="position-absolute px-3 py-2" style={{ right: "10px", top: "30px", cursor: "pointer" }}>
              <ul className="list-group fw-semibold z-2 shadow-lg">
                <li className="list-group-item" onClick={() => setFilter("Latest")}>Latest</li>
                <li className="list-group-item" onClick={() => setFilter("Trending")}>Trending</li>
              </ul>
            </div>
          )}
        </div>

        {/* Posts Display */}
        {filteredPosts?.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post._id}>
              <Post post={post} user={user} isUserProfile={true} />
            </div>
          ))
        ) : (
          <p className="text-center fw-semibold my-3 text-secondary">
            {posts?.length === 0 ? "No posts available" : "Loading..."}
          </p>
        )}
      </div>
      <Toaster />
    </>
  );
};

export default Feed;
