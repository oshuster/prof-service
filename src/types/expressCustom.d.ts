import { Client } from "pg";

declare module "express-serve-static-core" {
  interface Request {
    client?: Client;
  }
}
