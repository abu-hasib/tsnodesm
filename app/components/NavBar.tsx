import Link from "next/link";
import * as React from "react";
import { useLogoutMutation, useMeQuery } from "../src/generated/graphql";

interface NavBarProps {}
const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching, error }] = useMeQuery();
  const [{}, logout] = useLogoutMutation();
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
          <span>{data?.me?.email}</span>
        </li>
        <li>
          <button onClick={() => logout()}>logout</button>
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

export default NavBar;
