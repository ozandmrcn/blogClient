import { useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth-context";
import { useCreateComment } from "../../hooks/comment.hooks";
import { useParams } from "react-router-dom";

const CommentForm = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const { mutate, isPending } = useCreateComment();
  const inputRef = useRef<HTMLInputElement>(null);

  const hint = !user ? "Sign in to leave a comment" : "Post your comment";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Captured in a local so the ref is not re-read after the narrowing check.
    const input = inputRef.current;
    const content = input?.value.trim();

    if (!input || !content) return toast.warning("A comment cannot be empty.");

    // The input is cleared optimistically; the hook reports the real outcome
    // and the comment list is refetched only after the request succeeds.
    mutate({ blogId: id!, content });
    input.value = "";
  };

  return (
    <form className="flex items-center gap-2 mt-5" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        name="text"
        disabled={!user}
        title={hint}
        className="flex-1 border border-dark-20 rounded-md py-2 px-4 focus:border-white/70 outline-none disabled:bg-zinc-900 disabled:cursor-not-allowed"
        placeholder="Write your comment..."
      />

      <button
        title={hint}
        disabled={!user || isPending}
        className="bg-yellow-55 text-white text-shadow-black/40 text-shadow-md px-4 py-2 rounded-md cursor-pointer hover:bg-yellow-55/60 transition-colors disabled:cursor-not-allowed disabled:brightness-75"
      >
        Post
      </button>
    </form>
  );
};

export default CommentForm;
