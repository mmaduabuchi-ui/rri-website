import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  as?: "button" | "a";
  href?: string;
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  as = "button",
  href,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#1E824C] text-white hover:bg-[#16663A] focus-visible:ring-[#1E824C]",
    secondary:
      "border-2 border-[#1E824C] text-[#1E824C] hover:bg-[#1E824C] hover:text-white focus-visible:ring-[#1E824C]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-2.5 text-base rounded-lg",
    lg: "px-8 py-3.5 text-lg rounded-xl",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (as === "a" && href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}