import Head from "next/head";
import * as React from "react";
import NavBar from "./NavBar";
type ComponentWithChildProps = React.PropsWithChildren<{ example?: string }>;
interface LayoutProps {
  displayName: String;
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({
  children,
  displayName,
  ...others
}) => {
  // console.log("%%%: ", children);
  return (
    <>
      <NavBar pageProps />
      <Head>
        <title>{displayName}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
    </>
  );
};

const styles = {
  main: "p-4",
};

export default Layout;