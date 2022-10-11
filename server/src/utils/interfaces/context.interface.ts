import { Request, Response } from "express";
import { Redis } from "ioredis";

export interface MyContext {
  res: Response;
  req: Request;
  redis: Redis;
}
