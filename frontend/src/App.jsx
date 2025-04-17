import { Route, Routes, BrowserRouter } from "react-router-dom";
import Index from "./views/core/Index";
import Detail from "./views/core/Detail";
import About from "./views/pages/About";
import Register from "./views/auth/Register";
import Login from "./views/auth/Login";
import Logout from "./views/auth/Logout";
import Dashboard from "./views/dashboard/Dashboard";
import Posts from "./views/dashboard/Posts";
import AddPost from "./views/dashboard/AddPost";
import EditPost from "./views/dashboard/EditPost";
import Comments from "./views/dashboard/Comments";
import Notifications from "./views/dashboard/Notifications";
import Profile from "./views/dashboard/Profile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/:slug/" element={<Detail />} />

          {/* Authentication */}
          <Route path="/register/" element={<Register />} />
          <Route path="/login/" element={<Login />} />
          <Route path="/logout/" element={<Logout />} />

          {/* Dashboard */}
          <Route path="/dashboard/" element={<Dashboard />} />
          <Route path="/posts/" element={<Posts />} />
          <Route path="/add-post/" element={<AddPost />} />
          <Route path="/edit-post/:id/" element={<EditPost />} />
          <Route path="/comments/" element={<Comments />} />
          <Route path="/notifications/" element={<Notifications />} />
          <Route path="/profile/" element={<Profile />} />

          {/* Pages */}
          <Route path="/about/" element={<About />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;