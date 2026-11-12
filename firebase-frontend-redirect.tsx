"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const firebaseOrigin = "https://marinduquefoodtrip.com";

export default function FirebaseFrontendRedirect() {
  const pathname = usePathname();
  const isLocalPrototype = pathname.startsWith("/badges") || pathname.startsWith("/share/photos/");

  useEffect(() => {
    if (isLocalPrototype) return;
    const destination = `${firebaseOrigin}${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.replace(destination);
  }, [isLocalPrototype]);

  if (isLocalPrototype) return null;

  return (
    <div className="firebase-redirect" role="status">
      <p>Binubuksan ang Marinduque Food Trip…</p>
      <a href={firebaseOrigin}>Magpatuloy sa official site →</a>
    </div>
  );
}
