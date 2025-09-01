import * as React from "react";

export function Card({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`rounded-2xl border border-green-800/30 bg-green-600 shadow-lg transition hover:shadow-green-500/20 ${className}`}
        >
            {children}
        </div>
    );
}

export function CardContent({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={`p-6 ${className}`}>{children}</div>;
}
