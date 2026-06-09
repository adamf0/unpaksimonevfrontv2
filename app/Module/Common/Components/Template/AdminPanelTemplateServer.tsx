import AdminPanelTemplate from "./AdminPanelTemplate";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AccountInfo } from "../../Attribut/AccountInfo";

export default async function AdminPanelTemplateServer({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NEXT_EXPORT === "true") {
    const dummyUser = { Name: "Static User", Level: "admin" } as any;
    return (
      <AdminPanelTemplate userProfile={dummyUser}>
        {children}
      </AdminPanelTemplate>
    );
  }

  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;

  // ❌ tidak ada token
  if (!token) {
    redirect("/action/logout?r=Ex");
  }

  let user: AccountInfo;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/whoami`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      redirect("/action/logout?r=E1"); //di login page berhasil menampilkan toast
    }

    user = await res.json();
  } catch (err) {
    console.error("whoami error:", err);
    redirect("/action/logout?r=E0");
  }

  // ✅ VALIDASI ROLE
  const allowedRoles = ["admin", "fakultas", "prodi"];

  if (!allowedRoles.includes(user?.Level)) {
    redirect("/action/logout?r=F0");  //di login page berhasil menampilkan toast
  }

  // console.log("SERVER USER:", user);

  return (
    <AdminPanelTemplate userProfile={user}>
      {children}
    </AdminPanelTemplate>
  );
}