import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost";
    className?: string;
}

export function Button({
    children,
    className = "",
    variant = "default",
    ...props
}: ButtonProps) {
    const baseStyles =
        "px-4 py-2 rounded-xl font-medium transition flex items-center gap-2";

    let variantStyles = "";
    if (variant === "default") {
        variantStyles =
            "bg-green-600 text-white hover:bg-green-500 shadow-md";
    } else if (variant === "outline") {
        variantStyles =
            "border border-green-500 text-green-400 hover:bg-green-900/30";
    } else if (variant === "ghost") {
        variantStyles =
            "text-green-400 hover:text-green-300 hover:bg-green-900/20";
    }

    return (
        <button {...props} className={`${baseStyles} ${variantStyles} ${className}`}>
            {children}
        </button>
    );
}
