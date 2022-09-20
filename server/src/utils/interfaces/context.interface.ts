import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";
import { Redis } from "ioredis";

export interface MyContext {
  em: EntityManager<IDatabaseDriver<Connection>>;
  res: Response;
  req: Request;
  redis: Redis;
}
