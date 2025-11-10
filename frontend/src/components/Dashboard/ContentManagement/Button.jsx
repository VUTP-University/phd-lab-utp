/* ----- BUTTON ----- */

function Button({
  children,
  onClick,
  variant = "default",
  size = "md",
}) {
  const base =
    "rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline:
      "border border-gray-400 text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  );
}

export { Button };