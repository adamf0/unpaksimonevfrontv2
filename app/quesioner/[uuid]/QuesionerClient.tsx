import { useLayoutEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import QuesionerPage from "../../Module/Quesioner/Page/QuesionerPage";

export default function QuesionerClient({ uuid: propUuid }: { uuid?: string }) {
  const { uuid: paramsUuid } = useParams<{ uuid: string }>();
  const uuid = propUuid || paramsUuid || "";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const ctx = searchParams.get("ctx");

  if (typeof window !== "undefined" && ctx) {
    const cleanToken = ctx.replace(/^Bearer\s+/i, "").trim();
    localStorage.setItem("access_token", cleanToken);
    sessionStorage.setItem("access_token", cleanToken);
  }

  useLayoutEffect(() => {
    if (ctx) {
      navigate(`/quesioner/${uuid}`, { replace: true });
    }
  }, [ctx, uuid, navigate]);

  return <QuesionerPage uuid={uuid} />;
}