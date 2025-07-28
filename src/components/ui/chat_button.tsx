import type React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  isLoading,
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`relative rounded-lg px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gaming-electric-blue disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? <span className="animate-pulse">Loading...</span> : children}
    </button>
  );
};

export default Button;
