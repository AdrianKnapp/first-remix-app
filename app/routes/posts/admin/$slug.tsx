import type { LoaderFunction , ActionFunction} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { editPost, getPost } from "~/models/post.server";
import type { Post } from "~/models/post.server";

type ActionData =
  | {
      title: null | string;
      slug: null | string;
      markdown: null | string;
    }
  | undefined;

type LoaderData = { post: Post };
const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const initialSlug = formData.get("initialSlug");
  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  invariant(
    typeof initialSlug === "string",
    "initialSlug must be a string"
  );
  invariant(
    typeof title === "string",
    "title must be a string"
  );
  invariant(
    typeof slug === "string",
    "slug must be a string"
  );
  invariant(
    typeof markdown === "string",
    "markdown must be a string"
  );
  
  const errors: ActionData = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };
  const hasErrors = Object.values(errors).some(
    (errorMessage) => errorMessage
  );
  if (hasErrors) {
    return json<ActionData>(errors);
  }

  
  await editPost(initialSlug, { title, slug, markdown });

  return redirect("/posts/admin");
};

export const loader: LoaderFunction = async ({
  params 
}) => {
  invariant(params.slug, `params.slug is required`);

  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);

  return json<LoaderData>({ post });
}

const EditPost = () => {
  const { post } = useLoaderData() as unknown as LoaderData;

  return (
    <Form method="post" className="mt-6">
      <input type="hidden" name="initialSlug" value={post.slug}/>
      <p>
        <label>
          Post Title:{" "}
          <input
            key={post.title}
            defaultValue={post.title}
            type="text"
            name="title"
            className={inputClassName}
          />
        </label>
      </p>
      <p>
        <label>
          Post Slug:{" "}
          <input
            key={post.slug}
            defaultValue={post.slug}
            type="text"
            name="slug"
            className={inputClassName}
          />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>
        <br />
        <textarea
          key={post.slug}
          defaultValue={post.markdown}
          id="markdown"
          rows={20}
          name="markdown"
          className={`${inputClassName} font-mono`}
        />
      </p>
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          Update Post
        </button>
      </div>
    </Form>
  )
}

export default EditPost;