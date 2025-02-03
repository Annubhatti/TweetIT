import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FollowSection from "../../../components/FollowSection";
import Header from "../../../components/Header";
import Nav from "../../../components/Nav";
import { followUser, readUser, unfollowUser } from "../userSlice";
import Post from "./../../../components/Post";
import { useGetPosts } from "./../../../hooks/useGetPosts";
import { follow } from "./../../../utils/functions/follow";
import { unFollow } from "./../../../utils/functions/unfollow";
import { followed, readOtherUser, unfollowed } from "./otherUserSlice";
import { readUserById } from "../../../utils/functions/readUserById";
import { FaArrowLeftLong } from "react-icons/fa6";

const OtherProfile = () => {
  const [paramId, setParamId] = useState("");

  const [user, setUser] = useState({});

  const [isFollowerOpen, setIsFollowerOpen] = useState(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);

  const searchUserId = useParams();
  const { id } = searchUserId;

  useEffect(() => {
    setParamId(id);
  }, [id]);

  const dispatch = useDispatch();

  const mainUser = useSelector((state) => state.user.user);

  const userId = mainUser?._id;

  const otherUser = useSelector((state) => state.otherUser.otherUser);

  useEffect(() => {
    if (otherUser) {
      setUser(otherUser);
    }
  }, [otherUser]);

  useEffect(() => {
    dispatch(readOtherUser(paramId));
  }, [paramId]);

  useEffect(() => {
    dispatch(readUser());
  }, [user?.followers]);

  const posts = useGetPosts(user?._id);

  const followHandler = async () => {
    await follow({ followUserId: user?._id, userId });
    dispatch(readOtherUser(user?._id));

    dispatch(followed(user?._id));
    dispatch(followUser({ followUserId: user?._id, userId }));

    toast.success("Following");
  };

  const unFollowHandler = async () => {
    await unFollow({ followUserId: user?._id, userId });
    dispatch(readOtherUser(user?._id));

    dispatch(unfollowed(user?._id));

    dispatch(unfollowUser({ followUserId: user?._id, userId }));

    toast.success("unfollowed");
  };

  const getUsers = async () => {
    try {
      if (user?.followers?.length > 0) {
        const followers = await Promise.all(
          user?.followers.map(async (user) => await readUserById(user))
        );
        setFollowers(followers);
      }
      if (user?.following?.length > 0) {
        const following = await Promise.all(
          user?.following.map(async (user) => await readUserById(user))
        );

        setFollowing(following);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, [user]);

  return (
    <>
      <Header />
      <div className="mt-1 bg-body-tertiary container px-4 ">
        <div className="row">
          <div className="col-md-3">
            <Nav />
          </div>
          <div className="col-md-6">
            {!user ? (
              <p className="my-3 fw-semibold text-center">Loading ...</p>
            ) : (
              <div
                className="position-relative my-3 p-3 rounded-3"
                style={{ backgroundColor: "white" }}>
                <div className="d-flex justify-content-between">
                  <div className="d-flex">
                    <img
                      src={user.avatarUrl}
                      alt={user.userName}
                      style={{
                        height: "70px",
                        width: "70px",
                        borderRadius: "100%",
                      }}
                    />

                    <div>
                      <p className="fs-5 fw-bold px-3 m-0">{user.userName}</p>
                      <p className="fs-6 px-3 m-0">{user.userAt}</p>
                      <p className="fs-6 px-3 m-0">{user.bio}</p>
                      <hr />

                      {isFollowerOpen && (
                        <div
                          className="position-absolute p-3 rounded-3 shadow-lg justify-content-center"
                          style={{
                            backgroundColor: "white",
                            width: "200px",
                            right: "150px",
                          }}>
                          <span
                            className="px-1 py-3"
                            onClick={() => setIsFollowerOpen(false)}>
                            <FaArrowLeftLong style={{ fontSize: "20px" }} />
                          </span>
                          <div className="mt-2">
                            {followers && followers.length > 0 ? (
                              <>
                                {followers.map((user) => (
                                  <div
                                    key={user._id}
                                    className="d-flex mt-2 mx-0">
                                    <div>
                                      <img
                                        alt={user.userName}
                                        src={user.avatarUrl}
                                        className="img-fluid"
                                        style={{
                                          height: "35px",
                                          width: "35px",
                                          borderRadius: "100%",
                                        }}
                                      />
                                    </div>
                                    <p className="m-0  px-3 fw-semibold mt-1 ">
                                      {user.userName}
                                    </p>
                                  </div>
                                ))}
                              </>
                            ) : (
                              <p className="m-0 text-center fw-semibold">
                                No Follower
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      {isFollowingOpen && (
                        <div
                          className="position-absolute p-3 rounded-3 shadow-lg justify-content-center"
                          style={{
                            backgroundColor: "white",
                            width: "200px",
                            right: "0px",
                          }}>
                          <span
                            className="px-1 py-3"
                            onClick={() => setIsFollowingOpen(false)}>
                            <FaArrowLeftLong style={{ fontSize: "20px" }} />
                          </span>
                          <div className="mt-2">
                            {following && following.length > 0 ? (
                              <>
                                {following.map((user) => (
                                  <div
                                    key={user._id}
                                    className="d-flex mt-2 mx-0">
                                    <div>
                                      <img
                                        alt={user.userName}
                                        src={user.avatarUrl}
                                        className="img-fluid"
                                        style={{
                                          height: "35px",
                                          width: "35px",
                                          borderRadius: "100%",
                                        }}
                                      />
                                    </div>
                                    <p className="m-0  px-3 fw-semibold mt-1 ">
                                      {user.userName}
                                    </p>
                                  </div>
                                ))}
                              </>
                            ) : (
                              <p className="m-0 text-center fw-semibold">
                                No Following
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="d-flex justify-content-between">
                        <p className="fw-semibold m-0">
                          {user?.posts?.length} Post
                          {user?.posts?.length > 1 ? "s" : ""}
                        </p>
                        <p
                          className="fw-semibold m-0"
                          style={{ cursor: "pointer" }}
                          onClick={() => setIsFollowerOpen(true)}>
                          {user?.followers?.length} Follower
                          {user?.followers?.length > 1 ? "s" : ""}
                        </p>

                        <p
                          className="fw-semibold m-0"
                          style={{ cursor: "pointer" }}
                          onClick={() => setIsFollowingOpen(true)}>
                          {user?.following?.length} following
                        </p>
                      </div>
                    </div>

                    {user && (
                      <>
                        {mainUser &&
                        mainUser?.following?.includes(user?._id) ? (
                          <button
                            className="btn btn-light h-25 fw-semibold"
                            onClick={unFollowHandler}>
                            Unfollow
                          </button>
                        ) : (
                          <button
                            className="btn btn-light h-25 fw-semibold"
                            onClick={followHandler}>
                            Follow
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="my-3">
              {posts.length === 0 && (
                <p className="fw-semibold text-center">Loading...</p>
              )}
              {posts &&
                posts.length > 0 &&
                posts.map((post) => (
                  <div key={post._id}>
                    <Post post={post} user={mainUser} />
                  </div>
                ))}
            </div>
          </div>
          <div className="col-md-3">
            <FollowSection />
          </div>
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default OtherProfile;
