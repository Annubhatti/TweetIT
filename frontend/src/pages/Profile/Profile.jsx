import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import FollowSection from "../../components/FollowSection";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
import { readPosts } from "../Home/features/userPostSlice";
import Post from "./../../components/Post";
import { editUser, readUser } from "./userSlice";
import { FaArrowLeftLong } from "react-icons/fa6";
import { readUserById } from "../../utils/functions/readUserById";

const avatars = [
  "https://i.pravatar.cc/300?img=7",
  "https://i.pravatar.cc/300?img=6",
  "https://i.pravatar.cc/300?img=8",
  "https://i.pravatar.cc/300?img=9",
  "https://i.pravatar.cc/300?img=10",
];

const Profile = () => {
  const [user, setUser] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isFollowerOpen, setIsFollowerOpen] = useState(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);

  const dispatch = useDispatch();

  let userData = useSelector((state) => state.user.user);

  let posts = useSelector((state) => state.posts.posts);

  const getUsers = async () => {
    try {
      if (userData?.followers?.length > 0) {
        const followers = await Promise.all(
          userData?.followers.map(async (user) => await readUserById(user))
        );
        setFollowers(followers);
      }
      if (userData?.following?.length > 0) {
        const following = await Promise.all(
          userData?.following.map(async (user) => await readUserById(user))
        );

        setFollowing(following);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, [userData]);

  useEffect(() => {
    dispatch(readUser()).then(() => {
      setUser(userData || {});
    });
    dispatch(readPosts(userData._id));
  }, [dispatch, userData._id]);

  const editHandler = async () => {
    dispatch(editUser({ userData: user })).then(() => {
      dispatch(readUser()).then(() => {
        dispatch(readPosts(user._id)).then(() => {
          toast.success("Profile Updated");
          setIsEdit(false);
        });
      });
    });
  };

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
                  </div>

                  <button
                    className="btn btn-light h-25 fw-semibold"
                    onClick={() => setIsEdit((prev) => !prev)}>
                    Edit
                  </button>
                </div>
                {isEdit && (
                  <div className="d-flex justify-content-center">
                    <div
                      className="position-absolute  p-3 shadow-lg rounded-3 "
                      style={{
                        width: "300px",
                        backgroundColor: "white",
                        top: "0px",
                      }}>
                      <div onClick={() => setIsAvatarOpen((prev) => !prev)}>
                        <img
                          src={user.avatarUrl}
                          alt={user.userName}
                          style={{
                            height: "40px",
                            width: "40px",
                            borderRadius: "100%",
                          }}
                        />
                        {isAvatarOpen && (
                          <div
                            className="p-2 my-2 shadow-lg d-flex flex-wrap rounded-3"
                            style={{ backgroundColor: "white" }}>
                            {avatars.map((img) => (
                              <div
                                className="p-1"
                                key={img}
                                onClick={() =>
                                  setUser((prev) => ({
                                    ...prev,
                                    avatarUrl: img,
                                  }))
                                }>
                                <img
                                  style={{
                                    height: "40px",
                                    width: "40px",
                                    borderRadius: "100%",
                                  }}
                                  src={img}
                                  alt="avatar"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        <input
                          className="form-control fw-semibold"
                          value={user.userName}
                          onChange={(e) =>
                            setUser((prev) => ({
                              ...prev,
                              userName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="mt-3">
                        <textarea
                          className="form-control fw-semibold"
                          value={user.bio}
                          onChange={(e) =>
                            setUser((prev) => ({
                              ...prev,
                              bio: e.target.value,
                            }))
                          }
                          rows={3}></textarea>
                      </div>
                      <div className="mb-2 mt-3 d-flex justify-content-between ">
                        <button
                          className="btn btn-light fw-semibold"
                          onClick={editHandler}>
                          Update
                        </button>
                        <button
                          className="btn btn-light fw-semibold"
                          onClick={() => setIsEdit(false)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="my-3">
              {posts?.length === 0 && (
                <p className="fw-semibold text-center">Loading...</p>
              )}
              {posts &&
                posts.length > 0 &&
                posts.map((post) => (
                  <div key={post._id}>
                    <Post post={post} user={user} isUserProfile={true} />
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

export default Profile;
