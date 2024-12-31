import { ERROR } from "./error";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RES_TYPE<T = any> =
  | {
      status: "success";
      data?: T;
    }
  | {
      status: "error";
      error: ERROR;
    };
