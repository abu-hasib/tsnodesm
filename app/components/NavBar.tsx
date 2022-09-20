import { withUrqlClient } from "next-urql";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLogoutMutation, useMeQuery } from "../src/generated/graphql";
import { createUrqlClient } from "../src/utils/createUrqlClient";

interface NavBarProps {
  pageProps?: any;
}

const NavBar: React.FC<NavBarProps> = () => {
  const [isServer, setIsServer] = useState(false);
  const [{}, logout] = useLogoutMutation();
  const [{ data, fetching, error }] = useMeQuery();
  useEffect(() => {
    console.log("##: ", typeof window === "undefined");
    setIsServer(typeof window === "undefined"), [];
  });
  console.log("$$: ", data);
  let body;
  if (fetching || error) {
  } else if (!data?.me) {
    body = (
      <>
        <li className="hover:text-rose-400">
          <Link href="/login">login</Link>
        </li>
        <li className="hover:text-rose-400">
          <Link href="/register">register</Link>
        </li>
      </>
    );
  } else {
    body = (
      <>
        <li>
          <span>{data?.me?.username}</span>
        </li>
        <li>
          <button onClick={() => logout(data.me as never)}>logout</button>
        </li>
      </>
    );
  }
  return (
    <header className="flex bg-white text-gray-800 text-lg py-3 shadow-xl">
      <div className="flex justify-between items-center container mx-auto  px-8 w-full">
        <div className="brand"></div>
        <nav>
          <ul className="flex gap-4">{body}</ul>
        </nav>
      </div>
    </header>
  );
};

export default withUrqlClient(createUrqlClient)(NavBar);
