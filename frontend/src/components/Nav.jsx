import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineExplore } from "react-icons/md";
import { IoBookmarkOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <>
      <nav>
        <ul
          className=" fw-semibold fs-6 "
          style={{ listStyle: "none", padding: "0px" }}>
          <li className="mt-3 d-flex">
            <AiOutlineHome style={{ fontSize: "25px", marginBottom: "5px" }} />
            <span className="px-3">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </span>
          </li>
          <li className="mt-3 d-flex">
            <MdOutlineExplore
              style={{ fontSize: "25px", marginBottom: "5px" }}
            />
            <span className=" px-3">
              {" "}
              <Link className="nav-link" to="/explore">
                Explore
              </Link>
            </span>
          </li>
          <li className="mt-3 d-flex">
            <IoBookmarkOutline
              style={{ fontSize: "25px", marginBottom: "5px" }}
            />
            <span className=" px-3">
              {" "}
              <Link className="nav-link" to="/bookmark">
                Bookmark
              </Link>
            </span>
          </li>
          <li className="mt-3 d-flex ">
            <CgProfile style={{ fontSize: "25px", marginBottom: "5px" }} />
            <span className=" px-3">
              <Link className="nav-link" to="/profile">
                Profile
              </Link>
            </span>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Nav;
