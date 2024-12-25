"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { XIcon } from "lucide-react";
import { ERROR } from "@/types/error";
import { cn } from "@/lib/utils";

const LoginError = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [show, setShow] = useState(true);

  let errorFormatted: keyof typeof ERROR | undefined = undefined;
  for (const key in ERROR) {
    if (ERROR[key as keyof typeof ERROR] === error) {
      errorFormatted = key as keyof typeof ERROR;
    }
  }

  const getErrorMessage = (errorCode: keyof typeof ERROR) => {
    return ERROR[errorCode] || ERROR.DEFAULT;
  };

  if (!error || !show) return null;

  return (
    <div className={cn("w-full", "max-w-md")}>
      <div className="mb-4 flex w-full items-center justify-between rounded-lg border-2 border-red-500 p-2 text-red-600">
        <div className="flex gap-2">
          <div className="text-sm">
            {getErrorMessage(errorFormatted ?? "DEFAULT")}
          </div>
        </div>
        <XIcon
          className="h-5 w-5 cursor-pointer"
          onClick={() => {
            setShow(false);
            window.history.replaceState(
              {},
              "",
              window.location.pathname +
                window.location.search.replace(/(\?|&)error=[^&]*(&|$)/, "$1"),
            );
          }}
        />
      </div>
    </div>
  );
};

export default LoginError;
