import { MyContext } from "src/utils/interfaces/context.interface";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session.userId) throw new Error("not authenticated");
  else return next();
};
