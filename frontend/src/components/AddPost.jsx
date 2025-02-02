import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaRegImage } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdGif } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  editPost,
  editUserPost,
  readPosts,
} from "../pages/Home/features/userPostSlice";
import { RxCross2 } from "react-icons/rx";
import { readUser } from "../pages/Profile/userSlice";
import { addPost } from "../utils/functions/addPost";
import { IoVideocamOutline } from "react-icons/io5";

const AddPost = ({ setIsOpen, isEdit, postId, content }) => {
  const [description, setDescription] = useState(content || "");

  const [imageUrl, setImageUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [gifUrl, setGifUrl] = useState(null);
  const [isImageSelect, setIsImageSelect] = useState(false);

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  const userId = user?._id;

  const handleImageUpload = async (e) => {
    setImageUrl(true);
    const file = e.target.files[0];
    if (!file) return;
    toast.success("Please Wait ...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "fww4myo8");
    formData.append("cloud_name", "dbzzejye6");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dbzzejye6/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setImageUrl(data.url);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const handleVideoUpload = async (e) => {
    if (isImageSelect) {
      toast.error("image is selected");
      return;
    }
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 6000000) {
      toast.error("file is size is > 6MB");
      return;
    }
    toast.success("Please Wait ...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "fww4myo8");
    formData.append("cloud_name", "dbzzejye6");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dbzzejye6/video/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      toast.success("Please Wait ...");

      setVideoUrl(data.url);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };
  const handleGifUpload = async (e) => {
    if (isImageSelect) {
      toast.error("image is selected");
      return;
    }
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 6000000) {
      toast.error("file is size is > 6MB");
      return;
    }
    toast.success("Please Wait ...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "fww4myo8");
    formData.append("cloud_name", "dbzzejye6");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dbzzejye6/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      toast.success("Please Wait ...");

      setGifUrl(data.url);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const editHandler = async () => {
    dispatch(editPost({ postId, description })).then(() => {
      dispatch(editUserPost({ postId, description }));

      toast.success("Post Edited");
      setIsOpen(false);
    });
  };

  const postHandler = async () => {
    const data = {
      userId,
      post: {
        description,
        imageUrl,
        videoUrl,
        gifUrl,
      },
    };

    addPost(data).then(() => {
      dispatch(readUser()).then(() => {
        dispatch(readPosts(userId)).then(() => {
          toast.success("Post Added");
          setIsOpen(false);
        });
      });
    });
  };

  return (
    <div className="d-flex justify-content-center ">
      <div
        className="p-3 rounded-3 position-absolute z-2 shadow-lg"
        style={{
          backgroundColor: "white",
          width: "70%",
          top: isEdit ? "0px" : "20px",
          zIndex: 10,
        }}>
        <span className="px-1 py-3" onClick={() => setIsOpen(false)}>
          <FaArrowLeftLong style={{ fontSize: "20px" }} />
        </span>
        {imageUrl && (
          <div className="position-relative">
            <img src={imageUrl} className="w-100" />
            <span
              onClick={() => {
                setIsImageSelect(false);
                setImageUrl(null);
              }}
              className="position-absolute"
              style={{ top: "10px", right: "10px" }}>
              <RxCross2 style={{ fontSize: "25px" }} />
            </span>
          </div>
        )}
        {videoUrl && (
          <div className="position-relative">
            <video className="w-100" controls>
              <source src={videoUrl} type="video/mp4" />
            </video>
            <span
              onClick={() => {
                setVideoUrl(null);
              }}
              className="position-absolute"
              style={{ top: "10px", right: "10px" }}>
              <RxCross2 style={{ fontSize: "25px" }} />
            </span>
          </div>
        )}
        {gifUrl && (
          <div className="position-relative">
            <img src={gifUrl} className="w-100" />
            <span
              onClick={() => {
                setGifUrl(null);
              }}
              className="position-absolute"
              style={{ top: "10px", right: "10px" }}>
              <RxCross2 style={{ fontSize: "25px" }} />
            </span>
          </div>
        )}
        <div>
          <textarea
            className="form-control my-3"
            placeholder="What is Happening?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"></textarea>
        </div>
        <div className="d-flex justify-content-between">
          <div>
            <label htmlFor="image-upload">
              <FaRegImage style={{ fontSize: "20px", cursor: "pointer" }} />
            </label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />

            <label htmlFor="gif-upload">
              <MdGif
                style={{
                  fontSize: "30px",
                  marginLeft: "10px",
                  cursor: "pointer",
                }}
              />
            </label>
            <input
              type="file"
              id="gif-upload"
              accept="image/gif"
              style={{ display: "none" }}
              onChange={handleGifUpload}
            />
            <label htmlFor="video-upload">
              <IoVideocamOutline
                style={{
                  fontSize: "25px",
                  marginLeft: "10px",
                  cursor: "pointer",
                }}
              />
            </label>
            <input
              type="file"
              id="video-upload"
              accept="video/*"
              style={{ display: "none" }}
              onChange={handleVideoUpload}
            />
          </div>
          {isEdit ? (
            <button className="btn btn-light fw-semibold" onClick={editHandler}>
              Edit
            </button>
          ) : (
            <button className="btn btn-light fw-semibold" onClick={postHandler}>
              Post
            </button>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default AddPost;