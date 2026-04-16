// app/Module/Common/Components/Template/AdminPanelTemplateServer.tsx
import AdminPanelTemplate from "./AdminPanelTemplate";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AccountInfo } from "../../Attribut/AccountInfo";

//[pr] langsung baca dari redis
export default async function AdminPanelTemplateServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;

  // ❌ tidak ada token
  if (!token) {
    redirect("/api/logout?r=E0");
  }

  let user: AccountInfo;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/whoami`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      redirect("/api/logout?r=E1");
    }

    user = await res.json();
  } catch (err) {
    console.error("whoami error:", err);
    redirect("/api/logout?r=E0");
  }

  // ✅ VALIDASI ROLE
  const allowedRoles = ["admin", "fakultas", "prodi"];

  if (!allowedRoles.includes(user?.Level)) {
    redirect("/api/logout?r=F0");
  }

  console.log("SERVER USER:", user); // muncul di terminal

  return (
    <AdminPanelTemplate userProfile={user}>
      {children}
    </AdminPanelTemplate>
  );
}