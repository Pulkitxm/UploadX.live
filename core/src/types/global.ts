import { ERROR } from "@/types/error";

export type RES_TYPE =
  | {
      status: "success";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data?: any;
    }
  | {
      status: "error";
      error: ERROR;
    };
