"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { CheckCircle, AlertCircle, X } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onClose?: () => void;
  duration?: number;
}

const icons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error: <AlertCircle className="h-5 w-5 text-red-500" />,
  info: <AlertCircle className="h-5 w-5 text-blue-500" />,
};

export function Toast({ message, variant = "success", onClose, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg dark:bg-neutral-900 dark:border-neutral-800",
        "transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
      role="alert"
    >
      {icons[variant]}
      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto text-neutral-400 hover:text-neutral-600"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// ─── Toast provider ────────────────────────────────────────────────────────────

interface ToastItem {
  id: number;
  message: string;
  variant?: ToastVariant;
}

let toastCount = 0;
let globalAddToast: ((item: Omit<ToastItem, "id">) => void) | null = null;

export function addToast(message: string, variant: ToastVariant = "success") {
  globalAddToast?.({ message, variant });
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    globalAddToast = (item) => {
      const id = ++toastCount;
      setToasts((prev) => [...prev, { ...item, id }]);
    };
    return () => { globalAddToast = null; };
  }, []);

  const remove = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-2 sm:right-6" aria-live="polite">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          variant={t.variant}
          onClose={() => remove(t.id)}
        />
      ))}
    </div>
  );
}
