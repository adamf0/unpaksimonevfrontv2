import { useState, useEffect } from "react";
import AdminPanelTemplate from "./AdminPanelTemplate";
import { AccountInfo } from "../../Attribut/AccountInfo";
import apiCall from "../../External/APICall";

export default function AdminPanelTemplateServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userProfile, setUserProfile] = useState<AccountInfo | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchWhoAmI = async () => {
      try {
        const response = await apiCall.get("/whoami");
        const data = response.data;

        if (data && isMounted) {
          setUserProfile({
            ID: String(data.ID || data.id || ""),
            UUID: data.UUID || data.uuid || null,
            Username: String(data.Username || data.username || ""),
            Level: String(data.Level || data.level || ""),
            Name: String(data.Name || data.name || ""),
            Email: data.Email || data.email || null,
            RefFakultas: data.RefFakultas || data.ref_fakultas || null,
            Fakultas: data.Fakultas || data.fakultas || null,
            RefProdi: data.RefProdi || data.ref_prodi || null,
            Prodi: data.Prodi || data.prodi || null,
            Unit: data.Unit || data.unit || null,
            Resource: data.Resource || data.resource || null,
            CodeCtx: data.CodeCtx || data.code_ctx || null,
          });
        }
      } catch (error) {
        console.warn("Failed to fetch whoami profile in AdminPanelTemplateServer:", error);
      }
    };

    fetchWhoAmI();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!userProfile) {
    return null;
  }

  return <AdminPanelTemplate userProfile={userProfile}>{children}</AdminPanelTemplate>;
}