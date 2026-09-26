import { useNavigate, useParams } from "react-router-dom";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import ReactSelect from "react-select/creatable";
import { useEffect, useState } from "react";
import { mdeOptions, reactSelectOptions } from "../../utils/constants";
import { useBlog, useCreateBlog, useUpdateBlog } from "../../hooks/blog.hooks";
import PageLoader from "../../components/loader/page-loader";

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { data: blogData, isLoading: blogLoading } = useBlog(id!);
  const { mutate: createMutate, isPending: createPending } = useCreateBlog();
  const { mutate: updateMutate, isPending: updatePending } = useUpdateBlog();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  // Seed the form from the loaded post, or clear it for a new post.
  useEffect(() => {
    setTitle(blogData?.title || "");
    setContent(blogData?.content || "");
    setTags(blogData?.tags || []);
  }, [blogData]);

  const isPending = createPending || updatePending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEditMode) {
      updateMutate({ id: id!, values: { title, content, tags } });
    } else {
      createMutate({ title, content, tags });
    }
  };

  if (blogLoading) return <PageLoader />;

  return (
    <div className="max-w-3xl mx-auto padding-x py-10">
      <h1 className="text-3xl font-bold text-zinc-400 mb-8">{isEditMode ? "Edit post" : "New post"}</h1>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="group">
          <label htmlFor="title" className="label">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="input"
            placeholder="Enter a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="group">
          <label htmlFor="content" className="label">
            Content
          </label>

          <SimpleMDE
            id="content"
            className="prose"
            options={mdeOptions}
            value={content}
            onChange={(value) => setContent(value)}
          />
        </div>

        <div className="group">
          <label htmlFor="tags">Tags</label>

          <ReactSelect
            inputId="tags"
            isMulti
            styles={reactSelectOptions}
            placeholder="Add tags..."
            value={tags.map((tag) => ({ value: tag, label: tag }))}
            onChange={(selected) => setTags(selected.map((tag) => tag.value))}
          />
        </div>

        <div className="flex justify-end mt-5 gap-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-zinc-700 text-white px-4 py-2 rounded-md hover:bg-zinc-600 transition cursor-pointer"
          >
            Back
          </button>
          <button
            disabled={isPending}
            type="submit"
            className="bg-yellow-55 text-black px-4 py-2 rounded-md hover:bg-yellow-60 transition cursor-pointer disabled:cursor-not-allowed disabled:brightness-75"
          >
            {isEditMode ? "Update" : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
