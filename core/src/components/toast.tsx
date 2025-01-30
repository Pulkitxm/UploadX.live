"use client";

import { AlertCircle, CheckCircle, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { ERROR } from "@/types/error";

type ToastProps =
  | {
      message: string;
      type: "success" | "warning";
    }
  | {
      type: "error";
      message: ERROR;
    }
  | {
      message: string;
      type: "loading";
      promise: Promise<unknown>;
    };

const icons = {
  success: <CheckCircle className="h-6 w-6 text-emerald-600" />,
  error: <XCircle className="h-6 w-6 text-red-600" />,
  warning: <AlertCircle className="h-6 w-6 text-amber-600" />,
  loading: <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
};

export function showToast(props: ToastProps) {
  if (props.type === "loading" && props.promise) {
    toast.promise(props.promise, {
      loading: (
        <div className="flex items-center gap-2">
          {icons.loading}
          <p className="text-sm font-medium">{props.message}</p>
        </div>
      ),
      success: (
        <div className="flex items-center gap-2">
          {icons.success}
          <p className="text-sm font-medium">Success</p>
        </div>
      ),
      error: (
        <div className="flex items-center gap-2">
          {icons.error}
          <p className="text-sm font-medium">Error</p>
        </div>
      )
    });
  } else {
    return toast(
      <div className="flex items-center gap-2">
        {icons[props.type]}
        <p className="text-sm font-medium">{props.message}</p>
      </div>,
      {
        className: "rounded-md border bg-background p-4 shadow-lg",
        duration: 3000
      }
    );
  }
}
