interface ToastProps {
  message: string;
  type: "success" | "error";
}

const Toast = ({
  message,
  type,
}: ToastProps) => {
  if (!message) return null;

  return (
    <div
      className={`mb-5 px-4 py-3 rounded-lg text-sm font-medium border
      ${
        type === "success"
          ? "bg-green-100 text-green-700 border-green-400"
          : "bg-red-100 text-red-700 border-red-400"
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;