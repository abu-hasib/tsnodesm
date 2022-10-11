import { withUrqlClient } from "next-urql";
import Link from "next/link";
import { useState } from "react";
import Layout from "../components/Layout";
import { usePostsQuery } from "../src/generated/graphql";
import { createUrqlClient } from "../src/utils/createUrqlClient";
import styles from "../styles/Home.module.css";

function Home() {
  const [variables, setVariables] = useState({ limit: 10, cursor: null });
  const [{ data }] = usePostsQuery({
    variables,
  });
  const posts = data?.getPosts.posts;

  console.log(data);
  return (
    <Layout displayName="Home">
      <main className={styles.main}>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">TSNoSM</h2>
          <Link href="/create-post">Create post</Link>
        </div>

        <div>
          {!data ? (
            <div>load...</div>
          ) : (
            posts?.map((post) => (
              <section
                key={post.id}
                className="p-6 bg-white shadow-md my-5 rounded-sm"
              >
                <h2 className="font-bold text-lg">{post.title}</h2>
                <p>{post.text.slice(0, 70)}</p>
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
