import type { FC } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaTrash } from "react-icons/fa";
import { useDeleteBlog, useOwnBlogs } from "../../hooks/blog.hooks";
import PageLoader from "../../components/loader/page-loader";
import Error from "../../components/error";
import { truncate } from "../../utils/helpers";

const OwnBlogs: FC = () => {
  const { data, isLoading, error } = useOwnBlogs();
  const { mutate, isPending } = useDeleteBlog();

  if (isLoading) return <PageLoader />;
  if (error) return <Error message={error.message} />;

  const blogs = data?.blogs ?? [];

  return (
    <div className="py-5 padding-x">
      <h1 className="text-2xl font-bold">My posts</h1>

      <div className="grid grid-cols-1 gap-5 mt-10">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog.id} className="border-b border-dark-15 pb-5">
              <h2 className="font-semibold mb-2">{blog.title}</h2>
              <p className="text-zinc-400">{truncate(blog.content)}</p>

              <div className="mt-5 flex flex-wrap gap-5">
                <Link to={`/blog/${blog.id}`} className="blog-button">
                  Read post
                  <FaArrowRight className="size-3 text-yellow-55" />
                </Link>

                <Link to={`/blog/${blog.id}/edit`} className="blog-button">
                  Edit post
                  <FaArrowRight className="size-3 text-yellow-55" />
                </Link>

                <button disabled={isPending} onClick={() => mutate(blog.id)} className="blog-button">
                  Delete post
                  <FaTrash className="size-3 text-yellow-55" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-zinc-400 text-center text-lg">You have not published anything yet.</div>
        )}
      </div>
    </div>
  );
};

export default OwnBlogs;
