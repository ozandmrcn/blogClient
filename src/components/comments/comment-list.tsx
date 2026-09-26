import { useParams } from "react-router-dom";
import { useComments, useDeleteComment } from "../../hooks/comment.hooks";
import BasicLoader from "../loader/basic-loader";
import Error from "../error";
import { formatDate } from "../../utils/helpers";
import { FaTrash } from "react-icons/fa";
import { useAuth } from "../../context/auth-context";

const CommentList = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { mutate, isPending } = useDeleteComment();
  const { isLoading, error, data } = useComments(id!);

  if (isLoading) return <BasicLoader />;
  if (error) return <Error message={error.message} />;

  if (!data?.length) {
    return <p className="mt-10 text-zinc-400 text-center">No comments yet. Be the first to reply.</p>;
  }

  return (
    <div className="mt-10 flex flex-col">
      {data.map((comment) => (
        <div key={comment.id} className="py-5 border-b border-dark-20">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-2">
              <img src="/avatar.jpg" alt="" className="size-10 rounded-md" />

              <div>
                <p className="font-semibold">{comment.user.username}</p>
                <p className="text-sm text-zinc-500">{formatDate(comment.createdAt)}</p>
              </div>
            </div>

            {comment.user.id === user?.id && (
              <button
                aria-label="Delete comment"
                disabled={isPending}
                onClick={() => mutate({ blogId: id!, commentId: comment.id })}
                className="bg-zinc-800 border border-zinc-700 rounded-md p-2 hover:bg-zinc-600 transition cursor-pointer disabled:cursor-not-allowed disabled:brightness-75"
              >
                <FaTrash />
              </button>
            )}
          </div>

          <p className="mt-3 whitespace-pre-wrap break-words">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
