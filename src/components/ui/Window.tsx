import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  className?: string;
};

// Classic Mac-style window: striped title bar with a close box. Styles live in styles/surfaces.css.
export function Window({ title, children, className = "" }: Props) {
  return (
    <div className={`win ${className}`}>
      <div className="win-bar">
        <span className="win-close" aria-hidden />
        <span className="win-title">{title}</span>
      </div>
      {children}
    </div>
  );
}