import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Header from "./components/header";
import Footer from "./components/footer";
import Protected from "./components/protected";
import Detail from "./pages/detail";
import BlogForm from "./pages/form";
import OwnBlogs from "./pages/own-blogs";
import NotFound from "./pages/not-found";

const App = () => {
  return (
    <div className="bg-dark-08 text-white min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<Detail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Protected />}>
            <Route path="/blog/create" element={<BlogForm />} />
            <Route path="/blog/:id/edit" element={<BlogForm />} />
            <Route path="/own-blogs" element={<OwnBlogs />} />
          </Route>

          {/* Catches unknown paths, including the /about and /contact links the
              header used to expose without a matching route. */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
