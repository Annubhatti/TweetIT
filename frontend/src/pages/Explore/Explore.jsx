import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FollowSection from "../../components/FollowSection";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
import Post from "../../components/Post";
import { readUser } from "../Profile/userSlice";
import { fetchAllPosts } from "./postsSlice";

const Explore = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const posts = useSelector((state) => state.allPosts.posts);

  useEffect(() => {
    dispatch(readUser());
    dispatch(fetchAllPosts());
  }, []);

  return (
    <>
      <Header />
      <div className="mt-1 bg-body-tertiary container px-4 ">
        <div className="row">
          <div className="col-md-3">
            <Nav />
          </div>
          <div className="col-md-6 mb-5">
            <h4 className="text-center my-3 text-secondary">Explore</h4>
            {posts.length === 0 && (
              <p className="text-center fw-semibold my-3 text-secondary">
                Loading...
              </p>
            )}
            {posts &&
              posts.map((post) => (
                <div key={post._id}>
                  <Post post={post} user={user} />
                </div>
              ))}
          </div>
          <div className="col-md-3">
            <FollowSection />
          </div>
        </div>
      </div>
    </>
  );
};

export default Explore;
