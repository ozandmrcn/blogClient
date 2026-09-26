import type { FC } from "react";
import { Link } from "react-router-dom";

const NotFound: FC = () => {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <h1 className="text-6xl font-bold text-yellow-55">404</h1>
      <h2 className="text-2xl">This page does not exist</h2>
      <p className="text-zinc-400">The link may be broken, or the post may have been deleted.</p>

      <Link to="/" className="bg-zinc-700 px-4 py-2 rounded-md hover:bg-zinc-600 transition cursor-pointer">
        Back to home
      </Link>
    </div>
  );
};

export default NotFound;
