import type { Blog, CreateBlogValues, GetBlogParams, GetBlogResponse } from "../types";
import api from "./axios";

const blogService = {
  getAll: async (params?: GetBlogParams) => {
    const res = await api.get<GetBlogResponse>("/api/blog", { params });

    return res.data;
  },

  getOwn: async (params?: GetBlogParams) => {
    const res = await api.get<GetBlogResponse>("/api/blog/own", { params });

    return res.data;
  },

  create: async (values: CreateBlogValues) => {
    const res = await api.post<Blog>("/api/blog", values);

    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get<Blog>(`/api/blog/${id}`);

    return res.data;
  },

  update: async (id: string, values: Partial<CreateBlogValues>) => {
    const res = await api.patch<Blog>(`/api/blog/${id}`, values);

    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete<Blog>(`/api/blog/${id}`);

    return res.data;
  },
};

export default blogService;
