import Button from "../../components/button";
import { FaRegComment } from "react-icons/fa";

const Hero = () => {
  return (
    <div className="grid lg:grid-cols-7">
      <div className="lg:col-span-4 border border-dark-15">
        <div className="px-4 md:px-8 lg:px-12 xl:ps-18 pt-10 pb-8 md:py-16 xl:pt-20">
          <h4 className="text-dark-40 text-lg md:text-xl lg:text-2xl 2xl:text-3xl">
            A quiet place for loud ideas
          </h4>

          <h1 className="text-2xl md:text-3xl lg:text-4xl 2xl:text-6xl mt-3 mb-2">
            Write it down. Tag it. Talk about it.
          </h1>

          <p className="small-text">
            Inkwell is a blogging platform for people who like to explain things well. Publish a post in Markdown,
            tag it so the right readers find it, and keep the conversation going in the comments.
          </p>
        </div>

        <div className="grid grid-cols-3 border-t border-dark-15">
          <div className="border-r border-dark-15 p-5">
            <span className="flex items-center gap-1 text-lg md:text-xl xl:text-2xl">Markdown</span>
            <span className="small-text">Rich formatting</span>
          </div>
          <div className="p-5">
            <span className="flex items-center gap-1 text-lg md:text-xl xl:text-2xl">Tags</span>
            <span className="small-text">Organise every post</span>
          </div>
          <div className="border-l border-dark-15 p-5">
            <span className="flex items-center gap-1 text-lg md:text-xl xl:text-2xl">
              <FaRegComment className="text-yellow-55" />
            </span>
            <span className="small-text">Comments on every post</span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 border border-dark-15 relative overflow-hidden h-full max-lg:min-h-[300px] flex items-end p-5 md:p-8 lg:p-12">
        <div className="absolute top-0 left-0">
          <img src="/sun.png" alt="" className="rotate-[30deg] scale-[1.2] brightness-50" />
        </div>

        <div className="z-10">
          <h2 className="md:text-xl xl:text-2xl">Start reading</h2>

          <p className="small-text my-3">
            Browse everything published so far, or sign in to add your own take. Every post is dated, tagged and open
            for comments.
          </p>

          <Button text="Browse posts" to="/" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
