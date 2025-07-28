"use client";

import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
  className?: string;
};

const Button = ({
  children,
  isLoading,
  disabled,
  type = "button",
  onClick,
  className,
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled || isLoading}
    onClick={onClick}
    className={`w-full py-3 px-6 bg-[var(--gaming-blue)] text-[var(--gaming-white)] font-orbitron font-bold text-base uppercase
      tracking-wider rounded-lg focus:outline-none focus:ring-2 focus:ring-gaming-white/50 transform hover:scale-[1.02]
      transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group cursor-pointer ${
        className || ""
      }`}
  >
    <div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-gaming-white/20 to-transparent translate-x-[-100%]
      group-hover:translate-x-[100%] transition-transform duration-1000"
    />
    {isLoading ? (
      <div className="flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[var(--gaming-white)] border-t-transparent rounded-full animate-spin mr-2"></div>
        Loading...
      </div>
    ) : (
      children
    )}
  </button>
);

export default Button;
