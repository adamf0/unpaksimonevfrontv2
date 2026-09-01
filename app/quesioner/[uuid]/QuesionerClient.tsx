"use client";

import { useLayoutEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import QuesionerPage from "../../Module/Quesioner/Page/QuesionerPage";

export default function QuesionerClient({ uuid }: { uuid: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const ctx = searchParams.get("ctx");

  if (typeof window !== "undefined" && ctx) {
    localStorage.setItem("access_token", ctx);
    sessionStorage.setItem("access_token", ctx);
  }

  useLayoutEffect(() => {
    if (ctx) {
      router.replace(`/quesioner/${uuid}`);
    }
  }, [ctx, uuid, router]);

  return <QuesionerPage uuid={uuid} />;
}