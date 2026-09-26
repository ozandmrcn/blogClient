import { IoMdArrowRoundUp as Arrow } from "react-icons/io";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth-context";

const Header = () => {
  const { loading, user, logout } = useAuth();

  return (
    <header>
      <div className="bg-dark-08 text-sm md:text-base text-center px-4 py-2 md:px-6 md:py-3 font-inter flex justify-center gap-2">
        <span>Follow the authors you like and never miss a new post</span>
        <Arrow className="text-yellow-55 rotate-45" />
      </div>

      <div className="bg-dark-10 w-full padding-x py-5 flex justify-between items-center">
        <div>
          <img src="/logo.png" alt="Inkwell" className="w-[100px] lg:w-[140px] 2xl:w-[180px]" />
        </div>

        <nav className="flex items-center gap-4 text-sm md:text-base text-grey-50">
          <NavLink to="/">Home</NavLink>
          {user && <NavLink to="/own-blogs">My Posts</NavLink>}
        </nav>

        <div>
          {loading || !user ? (
            <Link
              to="/register"
              className="bg-yellow-55 text-black px-3 py-1 text-sm md:text-base rounded cursor-pointer"
            >
              Get started
            </Link>
          ) : (
            <div className="group relative text-sm md:text-base">
              <span>{user.username}</span>

              <div className="z-[99999] hidden group-hover:block absolute top-5 -right-2 bg-black p-1 rounded-md">
                <Link to="/blog/create" className="dropdown-item text-left">
                  Write a post
                </Link>
                <button onClick={logout} className="dropdown-item text-left">
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
