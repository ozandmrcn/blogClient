import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blog";
import type { CreateBlogValues, GetBlogParams } from "../types";
import { getApiErrorMessage } from "../utils/api-error";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useBlogs = (params?: GetBlogParams) =>
  useQuery({
    queryKey: ["blogs", params],
    queryFn: () => blogService.getAll(params),
  });

const useOwnBlogs = (params?: GetBlogParams) =>
  useQuery({
    queryKey: ["own-blogs", params],
    queryFn: () => blogService.getOwn(params),
  });

const useBlog = (id: string) =>
  useQuery({
    queryKey: ["blog", id],
    queryFn: () => blogService.getById(id),
    enabled: !!id,
  });

const useCreateBlog = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (values: CreateBlogValues) => blogService.create(values),
    onSuccess: (data) => {
      // A new post changes the total count on the home and profile lists.
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["own-blogs"] });
      toast.success("Post published.");
      navigate(`/blog/${data.id}`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not publish the post."));
    },
  });
};

const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: CreateBlogValues }) => blogService.update(id, values),
    onSuccess: (data) => {
      // The detail view shows the edited content, so its cache must go too.
      queryClient.invalidateQueries({ queryKey: ["blog", data.id] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["own-blogs"] });
      toast.success("Post updated.");
      navigate(`/blog/${data.id}`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not update the post."));
    },
  });
};

const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["own-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Post deleted.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not delete the post."));
    },
  });
};

export { useBlogs, useBlog, useCreateBlog, useUpdateBlog, useOwnBlogs, useDeleteBlog };
