import QuesionerClient from "./QuesionerClient";

type Props = {
  params: Promise<{
    uuid: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { uuid } = await params;

  return <QuesionerClient uuid={uuid} />;
}