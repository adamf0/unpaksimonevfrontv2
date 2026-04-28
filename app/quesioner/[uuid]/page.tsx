import { Suspense } from "react";
import QuesionerClient from "./QuesionerClient";

type Props = {
  params: Promise<{
    uuid: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { uuid } = await params;

  return <Suspense fallback={null}>
    <QuesionerClient uuid={uuid} />
  </Suspense>;
}