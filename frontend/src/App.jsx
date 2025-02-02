import React from "react";
import Home from "./pages/Home/Home";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Explore from "./pages/Explore/Explore";
import Bookmark from "./pages/Bookmark/Bookmark";
import Profile from "./pages/Profile/Profile";
import OtherProfile from "./pages/Profile/features/OtherProfile";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/bookmark" element={<Bookmark />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user-profile/:id" element={<OtherProfile />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;