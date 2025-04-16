import { useCallback } from "react";

export function useToast() {
  const toast = useCallback((options) => {
    const {
      title = "",
      description = "",
      duration = 3000,
      variant = "default", // puedes usar "success", "error", etc.
    } = options || {};

    const toastContainerId = "custom-toast-container";
    let container = document.getElementById(toastContainerId);

    if (!container) {
      container = document.createElement("div");
      container.id = toastContainerId;
      container.className = "fixed bottom-4 right-4 z-[9999] space-y-2";
      document.body.appendChild(container);
    }

    const toastEl = document.createElement("div");
    toastEl.className = `
      bg-white border text-sm text-gray-800 shadow-md rounded-lg px-4 py-3 w-72
      ${variant === "success" ? "border-green-500" : ""}
      ${variant === "error" ? "border-red-500" : ""}
      ${variant === "default" ? "border-gray-300" : ""}
    `;

    toastEl.innerHTML = `
      <div class="font-semibold">${title}</div>
      <div class="text-gray-600 mt-1">${description}</div>
    `;

    container.appendChild(toastEl);

    setTimeout(() => {
      toastEl.remove();
    }, duration);
  }, []);

  return { toast };
}
