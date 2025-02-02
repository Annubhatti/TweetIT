import React, { useEffect, useState } from "react";

import { FaArrowLeftLong } from "react-icons/fa6";
import { FaRegImage } from "react-icons/fa6";
import { MdGif } from "react-icons/md";
import { FiSliders } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { readUser } from "../../Profile/userSlice";
import Post from "../../../components/Post";
import { useGetPosts } from "../../../hooks/useGetPosts";
import { useSortPost } from "../../../hooks/useSortPost";
import { readPosts } from "./userPostSlice";
import AddPost from "../../../components/AddPost";
import { Toaster } from "react-hot-toast";

const Feed = () => {
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [filter, setFilter] = useState("");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const posts = useSelector((state) => state.posts.posts);
  const { _id } = user;

  useEffect(() => {
    dispatch(readUser()).then(() => {
      if (_id) {
        dispatch(readPosts(_id)).then(() => {});
      }
    });
  }, [dispatch, _id]);

  const filteredPosts = useSortPost(filter, posts);
  return (
    <>
      <div className="position-relative mb-5">
        <div
          onClick={() => setIsPostOpen(true)}
          className="my-3 py-2 px-3 d-flex rounded-3"
          style={{ backgroundColor: "white" }}>
          <img
            src={user ? user.avatarUrl : "https://via.placeholder.com/50"}
            style={{ height: "50px", width: "50px", borderRadius: "100%" }}
          />
          <p
            className="m-0 px-4 fw-semibold"
            style={{ position: "relative", top: "13px" }}>
            What is happening?
          </p>
        </div>
        {isPostOpen && <AddPost setIsOpen={setIsPostOpen} />}

        <div className="position-relative" style={{ backgroundColor: "white" }}>
          <div className="d-flex justify-content-between  my-4 px-3 py-2">
            <p className="m-0 fw-semibold">{filter} Posts</p>
            <span onClick={() => setIsFilter((prev) => !prev)}>
              <FiSliders />
            </span>
          </div>
          {isFilter && (
            <div
              className="position-absolute px-3 py-2 "
              style={{ right: "10px", top: "30px", cursor: "pointer" }}>
              <ul className="list-group fw-semibold z-2 shadow-lg">
                <li
                  className="list-group-item"
                  onClick={() => setFilter("Latest")}>
                  Latest
                </li>
                <li
                  className="list-group-item"
                  onClick={() => setFilter("Trending")}>
                  Trending
                </li>
              </ul>
            </div>
          )}
        </div>
        {filteredPosts && filteredPosts.length === 0 && (
          <p className="text-center fw-semibold my-3 text-secondary">
            Loading...
          </p>
        )}

        {filteredPosts &&
          filteredPosts.length > 0 &&
          filteredPosts.map((post) => (
            <div key={post._id}>
              {user && post && (
                <Post post={post} user={user} isUserProfile={true} />
              )}
            </div>
          ))}
      </div>
      <Toaster />
    </>
  );
};

export default Feed;
