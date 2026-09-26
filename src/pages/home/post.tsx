import type { FC } from "react";
import { Link } from "react-router-dom";
import { FaRegComment } from "react-icons/fa";
import type { Blog } from "../../types";
import { formatDate, truncate } from "../../utils/helpers";

interface Props {
  data: Blog;
}

const Post: FC<Props> = ({ data }) => {
  return (
    <Link
      to={`/blog/${data.id}`}
      className="flex flex-col gap-5 md:gap-12 md:grid md:grid-cols-[1fr_2fr_1fr] py-5 padding-x border-b border-dark-20"
    >
      <div className="flex gap-3">
        <img src="/avatar.jpg" alt="" className="size-10 rounded-full" />

        <div className="max-md:flex items-center gap-3">
          <h5 className="font-semibold">{data.author.username}</h5>
          <span className="text-sm text-gray-400">{data.author.email}</span>
          <p className="text-sm text-gray-400">{formatDate(data.createdAt)}</p>
        </div>
      </div>

      <div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">{data.title}</h2>

          <p className="text-sm text-gray-400">{truncate(data.content)}</p>
        </div>

        <div className="flex gap-5 mt-5">
          <span className="post-btn cursor-default">
            <FaRegComment />
            <span className="text-sm">{data.commentCount}</span>
            <span className="text-sm sr-only">comments</span>
          </span>
        </div>
      </div>

      <div className="flex items-center max-md:hidden">
        <span className="border border-zinc-700 rounded-lg py-2 px-4 flex items-center gap-2">Read post</span>
      </div>
    </Link>
  );
};

export default Post;
