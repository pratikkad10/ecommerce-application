import { Toaster as Sonner, toast as sonnerToast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-surface group-[.toaster]:text-on-surface group-[.toaster]:border-outline-variant/30 group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl group-[.toaster]:p-4",
          description: "group-[.toast]:text-on-surface-variant group-[.toast]:text-body-sm",
          actionButton:
            "group-[.toast]:bg-primary-container group-[.toast]:text-on-primary group-[.toast]:rounded-xl group-[.toast]:px-4 group-[.toast]:py-2",
          cancelButton:
            "group-[.toast]:bg-surface-variant group-[.toast]:text-on-surface-variant group-[.toast]:rounded-xl group-[.toast]:px-4 group-[.toast]:py-2",
          error:
            "group-[.toaster]:bg-error/95 group-[.toaster]:text-white group-[.toaster]:border-error",
          success:
            "group-[.toaster]:bg-tertiary-container/95 group-[.toaster]:text-on-tertiary-container group-[.toaster]:border-tertiary",
          warning:
            "group-[.toaster]:bg-secondary-container/95 group-[.toaster]:text-on-secondary-container group-[.toaster]:border-secondary",
          info:
            "group-[.toaster]:bg-primary-container/95 group-[.toaster]:text-on-primary-container group-[.toaster]:border-primary",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, sonnerToast as toast };
