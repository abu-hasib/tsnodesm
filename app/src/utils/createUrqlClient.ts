import {
  Cache,
  cacheExchange,
  QueryInput,
  Resolver,
} from "@urql/exchange-graphcache";
import Router from "next/router";
import {
  dedupExchange,
  errorExchange,
  fetchExchange,
  stringifyVariables,
} from "urql";
import {
  ChangePasswordMutation,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../generated/graphql";

function typedUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    console.log("allFields: ", allFields);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    // const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    // const isItInTheCache = cache.resolveFieldByKey(entityKey, fieldKey);
    // info.partial = !isItInTheCache;
    // const results: string[] = [];
    // fieldInfos.forEach((fi) => {
    //   const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
    //   const data = cache.resolve(key, "posts") as string[];
    //   console.log("***: ", data);
    //   results.push(...data);
    // });

    // return {
    //   __typename: "PostObject",
    //   posts: results,
    // };

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isItInTheCache;
    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      console.log("##: ", data);
      const _hasMore = cache.resolve(key, "hasMore");
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    });

    return {
      __typename: "PostObject",
      hasMore,
      posts: results,
    };
  };
};

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      resolvers: {
        Query: {
          getPosts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          createPost: (_result, _args, cache, _info) => {
            cache.invalidate("Query", "getPosts", { limit: 10 });
          },
          login: (_result, _args, cache, _info) => {
            typedUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          register: (_result, _args, cache, _info) => {
            typedUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
          logout: (_result, _args, cache, _info) => {
            typedUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => {
                return { me: null };
              }
            );
          },
          changePassword: (_result, _args, cache, _info) => {
            typedUpdateQuery<ChangePasswordMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, _query) => {
                return {
                  me: result.changePassword.user,
                };
              }
            );
          },
        },
      },
    }),
    ssrExchange,
    errorExchange({
      onError(error) {
        // console.error("###: ", error);
        if (error.message.includes("not authenticated"))
          Router.replace("/login");
      },
    }),
    fetchExchange,
  ],
});
