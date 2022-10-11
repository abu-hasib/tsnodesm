import { useRouter } from "next/router";
import React from "react";
import { useMeQuery } from "../generated/graphql";

export function useIsAuth() {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();

  React.useEffect(() => {
    if (!fetching && !data?.me) {
      console.log(router);
      router.replace("/login?next=" + router.pathname);
    }
  }, [router, data, fetching]);
}
