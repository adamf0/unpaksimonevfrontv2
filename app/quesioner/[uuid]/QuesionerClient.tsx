"use client";

import { useLayoutEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import QuesionerPage from "../../Module/Quesioner/Page/QuesionerPage";

export default function QuesionerClient({ uuid }: { uuid: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const ctx = searchParams.get("ctx");
  console.log("QuesionerClient.ctx: ",ctx)

  if (typeof window !== "undefined" && ctx) {
    const cleanToken = ctx.replace(/^Bearer\s+/i, "").trim();
    localStorage.setItem("access_token", cleanToken);
    sessionStorage.setItem("access_token", cleanToken);
  }

  useLayoutEffect(() => {
    if (ctx) {
      router.replace(`/quesioner/${uuid}`);
    }
  }, [ctx, uuid, router]);

  return <QuesionerPage uuid={uuid} />;
}