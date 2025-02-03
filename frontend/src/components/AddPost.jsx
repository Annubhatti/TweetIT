import React, { useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaRegImage } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdGif } from "react-icons/md";
import { IoVideocamOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import {
  editPost, editUserPost, readPosts
} from "../pages/Home/features/userPostSlice";
import { readUser } from "../pages/Profile/userSlice";
import { addPost } from "../utils/functions/addPost";

const AddPost = ({ setIsOpen, isEdit, postId, content }) => {
  const [description, setDescription] = useState(content || "");
  const [media, setMedia] = useState({ imageUrl: null, videoUrl: null, gifUrl: null });
  const [isUploading, setIsUploading] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const userId = user?._id;

  // Helper function for file uploads
  const handleFileUpload = useCallback(async (e, type) => {
    if (isUploading) return;

    const file = e.target.files[0];
    if (!file) return;

    if ((type === "video" || type === "gif") && file.size > 6000000) {
      toast.error("File size should be ≤ 6MB");
      return;
    }

    setIsUploading(true);
    toast.loading("Uploading...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "fww4myo8");
    formData.append("cloud_name", "dbzzejye6");

    try {
      const uploadType = type === "video" ? "video" : "image";
      const res = await fetch(`https://api.cloudinary.com/v1_1/ditvbzsrh/${uploadType}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      toast.dismiss();
      toast.success("Upload successful");

      setMedia((prev) => ({
        ...prev,
        [`${type}Url`]: data.url,
      }));
    } catch (error) {
      toast.dismiss();
      toast.error("Upload failed");
      console.error(error.message);
    } finally {
      setIsUploading(false);
    }
  }, [isUploading]);

  // Edit Post Handler
  const editHandler = async () => {
    dispatch(editPost({ postId, description })).then(() => {
      dispatch(editUserPost({ postId, description }));
      toast.success("Post Edited");
      setIsOpen(false);
    });
  };

  // Create Post Handler
  const postHandler = async () => {
    const data = {
      userId,
      post: {
        description,
        ...media,
      },
    };

    try {
      await addPost(data);
      await dispatch(readUser());
      await dispatch(readPosts(userId));
      toast.success("Post Added");
      setIsOpen(false);
    } catch (error) {
      toast.error("Error adding post");
      console.error(error);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div
        className="p-3 rounded-3 position-absolute z-2 shadow-lg"
        style={{
          backgroundColor: "white",
          width: "70%",
          top: isEdit ? "0px" : "20px",
          zIndex: 10,
        }}
      >
        {/* Close Button */}
        <span className="px-1 py-3" onClick={() => setIsOpen(false)}>
          <FaArrowLeftLong style={{ fontSize: "20px", cursor: "pointer" }} />
        </span>

        {/* Media Preview */}
        {["imageUrl", "videoUrl", "gifUrl"].map((key) => (
          media[key] && (
            <div key={key} className="position-relative">
              {key === "videoUrl" ? (
                <video className="w-100" controls>
                  <source src={media[key]} type="video/mp4" />
                </video>
              ) : (
                <img src={media[key]} className="w-100" alt="Uploaded" />
              )}
              <span
                onClick={() => setMedia((prev) => ({ ...prev, [key]: null }))}
                className="position-absolute"
                style={{ top: "10px", right: "10px", cursor: "pointer" }}
              >
                <RxCross2 style={{ fontSize: "25px" }} />
              </span>
            </div>
          )
        ))}

        {/* Text Input */}
        <textarea
          className="form-control my-3"
          placeholder="What is Happening?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="5"
        />

        {/* Action Buttons */}
        <div className="d-flex justify-content-between">
          {/* Media Upload Buttons */}
          <div>
            <label htmlFor="image-upload">
              <FaRegImage style={{ fontSize: "20px", cursor: "pointer" }} />
            </label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFileUpload(e, "image")}
            />

            <label htmlFor="gif-upload">
              <MdGif style={{ fontSize: "30px", marginLeft: "10px", cursor: "pointer" }} />
            </label>
            <input
              type="file"
              id="gif-upload"
              accept="image/gif"
              style={{ display: "none" }}
              onChange={(e) => handleFileUpload(e, "gif")}
            />

            <label htmlFor="video-upload">
              <IoVideocamOutline style={{ fontSize: "25px", marginLeft: "10px", cursor: "pointer" }} />
            </label>
            <input
              type="file"
              id="video-upload"
              accept="video/*"
              style={{ display: "none" }}
              onChange={(e) => handleFileUpload(e, "video")}
            />
          </div>

          {/* Post / Edit Button */}
          {isEdit ? (
            <button className="btn btn-light fw-semibold" onClick={editHandler} disabled={isUploading}>
              Edit
            </button>
          ) : (
            <button className="btn btn-light fw-semibold" onClick={postHandler} disabled={isUploading}>
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
