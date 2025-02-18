"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });

export default function LoadingBar() {
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    NProgress.start();

    startTransition(() => {
      setLoading(false);
      NProgress.done();
    });
  }, [pathname]);

  return null;
}
