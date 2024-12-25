"use client";

import { toast } from "sonner";
import { AlertCircle, CheckCircle, Loader2, XCircle } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "loading";

interface ToastProps {
  message: string;
  type: ToastType;
}

const icons = {
  success: <CheckCircle className="h-6 w-6 text-emerald-600" />,
  error: <XCircle className="h-6 w-6 text-red-600" />,
  warning: <AlertCircle className="h-6 w-6 text-amber-600" />,
  loading: <Loader2 className="h-6 w-6 animate-spin text-sky-600" />,
};

export function showToast({ message, type }: ToastProps) {
  return toast(
    <div className="flex items-center gap-2">
      {icons[type]}
      <p className="text-sm font-medium">{message}</p>
    </div>,
    {
      className: "rounded-md border bg-background p-4 shadow-lg",
      duration: 3000,
    },
  );
}
