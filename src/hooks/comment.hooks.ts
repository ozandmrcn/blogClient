import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import commentService from "../services/comment";
import { getApiErrorMessage } from "../utils/api-error";
import { toast } from "react-toastify";

const useComments = (blogId: string) =>
  useQuery({
    queryKey: ["comments", blogId],
    queryFn: () => commentService.getAll(blogId),
    // Without a post id there is nothing to request yet.
    enabled: !!blogId,
  });

const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ blogId, content }: { blogId: string; content: string }) => commentService.create(blogId, content),
    // The new comment is only persisted once the request resolves, so the
    // success toast is raised here rather than by the form on submit.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("Comment posted.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not post the comment.")),
  });
};

const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ blogId, commentId }: { blogId: string; commentId: string }) =>
      commentService.delete(blogId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("Comment deleted.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not delete the comment.")),
  });
};

export { useComments, useCreateComment, useDeleteComment };
