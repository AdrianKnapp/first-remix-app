import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { FiTrash2 } from 'react-icons/fi'
import { deletePost, getPosts } from "~/models/post.server";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPosts>>;
};

export const loader: LoaderFunction = async () => {
  return json({ posts: await getPosts() });
};

const handleDeletePost = async (slug: string) => {
  await deletePost(slug);
}

export default function PostAdmin() {
  const { posts } = useLoaderData() as unknown as LoaderData;
  
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="my-6 mb-2 pb-4 border-b-2 text-center text-3xl">
        Blog Admin
      </h1>
      <div className="grid grid-cols-6 gap-6">
        <nav className="col-span-4 md:col-span-2">
          <ul className="flex flex-col gap-3">
            {posts.map((post) => (
              <li key={post.slug} className="flex justify-between">
                <Link
                  to={post.slug}
                  className="text-blue-600 underline"
                >
                  {post.title}
                </Link>
                <button className="px-2 text-base opacity-50 hover:opacity-80 transition duration-250" onClick={() => handleDeletePost(post.slug)}>
                  <FiTrash2 />
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <main className="col-span-4 md:col-span-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}