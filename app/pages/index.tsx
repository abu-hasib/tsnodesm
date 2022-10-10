import { withUrqlClient } from "next-urql";
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import NavBar from "../components/NavBar";
import { usePostsQuery } from "../src/generated/graphql";
import { createUrqlClient } from "../src/utils/createUrqlClient";
import styles from "../styles/Home.module.css";

function Home() {
  const [{ data }] = usePostsQuery({
    variables: { limit: 2 },
  });
  return (
    <Layout displayName="Home">
      <main className={styles.main}>
        <h2 className="text-3xl font-bold underline">Hello World!</h2>

        <div>
          <Link href="/create-post">Create post</Link>
          {!data ? (
            <div>load...</div>
          ) : (
            data.getPosts.map((post) => <h1 key={post.id}>{post.title}</h1>)
          )}
        </div>
      </main>
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
