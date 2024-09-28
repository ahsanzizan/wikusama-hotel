"use client";
import { ReactNode, useEffect } from "react";

export default function DisableContextAndDevTools({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    const handleContextMenu: (this: Document, e: MouseEvent) => any = (e) => {
      e.preventDefault();
    };
    const handleDevTools: (this: Document, ev: KeyboardEvent) => any = (e) => {
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleDevTools);

    // Clean up event listeners on component unmount
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleDevTools);
    };
  }, []);

  return <>{children}</>;
}