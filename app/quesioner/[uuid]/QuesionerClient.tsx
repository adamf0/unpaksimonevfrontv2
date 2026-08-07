"use client";

import { useLayoutEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import QuesionerPage from "../../Module/Quesioner/Page/QuesionerPage";

export default function QuesionerClient({ uuid }: { uuid: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const ctx = searchParams.get("ctx");

  useLayoutEffect(() => {
    if (ctx) {
      localStorage.setItem("access_token", ctx);
      sessionStorage.setItem("access_token", ctx);
      router.replace(`/quesioner/${uuid}`);
    }
  }, [ctx, uuid, router]);

  return <QuesionerPage uuid={uuid} />;
}