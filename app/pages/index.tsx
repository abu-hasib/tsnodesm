import { withUrqlClient } from "next-urql";
import Link from "next/link";
import { useState } from "react";
import Layout from "../components/Layout";
import { usePostsQuery, useVoteMutation } from "../src/generated/graphql";
import { createUrqlClient } from "../src/utils/createUrqlClient";
import styles from "../styles/Home.module.css";

function Home() {
  const [variables, setVariables] = useState({ limit: 10, cursor: null });
  const [{ data }] = usePostsQuery({
    variables,
  });
  const [, vote] = useVoteMutation();
  const posts = data?.getPosts.posts;

  const upvote = async (value: number, postId: number) => {
    await vote({ value, postId });
  };
  // console.log("data: ", data);
  return (
    <Layout displayName="Home">
      <main className={styles.main}>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">SM</h2>
          <Link href="/create-post">Create post</Link>
        </div>

        <div>
          {!data ? (
            <div>load...</div>
          ) : (
            posts?.map((post) => (
              <section
                key={post.id}
                className="flex gap-8 p-6 bg-white shadow-md my-5 rounded-sm"
              >
                <div className="flex flex-col items-center">
                  <button
                    className="px-4 bg-green-300 rounded-md"
                    onClick={() => upvote(1, post.id)}
                  >
                    up
                  </button>
                  <p>{post.points}</p>
                  <button className="px-4 bg-red-300 rounded-md">down</button>
                </div>
                <div>
                  <h2 className="font-bold text-lg">
                    {post.title}{" "}
                    <span className="font-normal italic">
                      by {post.creator.username}
                    </span>
                  </h2>
                  <p>{post.text.slice(0, 70)}</p>
                </div>
              </section>
            ))
          )}
          {data && data.getPosts.hasMore ? (
            <button
              className="p-2 my-4 bg-red-50 rounded-md"
              onClick={() =>
                setVariables({
                  cursor: posts![posts!.length - 1].createdAt,
                  limit: variables.limit,
                })
              }
            >
              load more
            </button>
          ) : null}
        </div>
      </main>
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
