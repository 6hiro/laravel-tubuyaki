import React from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Layout from "../components/layout/Layout";
import Home from "../pages/Home/Home";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import Settings from "../pages/Auth/Settings";
import Profiles from "../components/profile/Profiles";
import Profile from "../pages/Profile/Profile"
import PostList from "../pages/Post/PostList";
import FavoritePost from "../pages/Post/FavoritePost";
import AddPost from "../pages/Post/AddPost";
import PostDetail from "../pages/post/PostDetail";
import PostHashtag from "../pages/post/PostHashtag";
import PostSearch from "../pages/post/PostSearch";

const Core: React.FC = () => {
  
  return (
    <div>
      <BrowserRouter>
        {/* Layout */}
        <Layout />
        {/* いいねした人やfollower、followeeの一覧 */}
        <Profiles />

        <main className="main">
          <section>
            <Routes>
              {/* Auth */}
              <Route path="/register" element={<Register />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/settings" element={<Settings />} />
              {/* Profile */}
              <Route path="/prof/:id" element={<Profile />} />
              {/* Post */}
              <Route path="/" element={<Home />} />
              <Route path="/post/add" element={<AddPost />} />
              <Route path="/post/list" element={<PostList />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/post/hashtag/:id" element={<PostHashtag />} />
              <Route path="/post/user/:id/like" element={<FavoritePost />} />
              <Route path="/search/:word/" element={<PostSearch />} />
            </Routes>
          </section>
        </main>
      </BrowserRouter>
    </div>
  );
};

export default Core;