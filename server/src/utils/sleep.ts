import { Post } from "../entities/post.entity";

export const sleep = (ms: number) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(Post);
    }, ms)
  );
