import { redirect } from "next/navigation";

export async function GET(
  req: Request,
  context: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await context.params;

  const url = new URL(req.url);
  const ctx = url.searchParams.get("ctx");

  if (!ctx) {
    redirect(`/quesioner/${uuid}`);
  }

  redirect(`/quesioner/${uuid}?ctx=${ctx}`);
}