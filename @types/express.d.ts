import { Service } from "~/service";

export declare global {
  namespace Express {
    interface Locals {
      service: Service;
    }
  }
}
