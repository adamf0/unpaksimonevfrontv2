"use client";

import { ActionButtons } from "../../Common/Components/Molecules/ActionButtons";
import Badge from "../../Common/Components/Atoms/Badge";
import { ActionItem } from "../../Common/Components/Attribut/ActionItem";
import { isEmpty } from "../../Common/Service/utility";
import { useToast } from "../../Common/Context/ToastContext";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";
import { UserItem } from "../Attribut/UserItem";
import { useAccountContext } from "../Context/AccountProvider";

interface Props {
  data: any[];
  loading?: boolean;
  openDelete: (item: UserItem) => void;
  openForceDelete: (item: UserItem) => void;
}

/* =========================
   MAPPER (API → DOMAIN)
========================= */
export function mapUser(api: any): UserItem {
  return {
    UUID: api.UUID,
    Username: api.Username,
    Level: api.Level,
    Name: api.Name,
    Email: api.Email,
    RefFakultas: api.RefFakultas,
    Fakultas: api.Fakultas,
    RefProdi: api.RefProdi,
    Prodi: api.Prodi,
    DeletedAt: api.DeletedAt,
  };
}

/* =========================
   TABLE COMPONENT
========================= */
export function AccountTable({
  data = [],
  loading = false,
  openDelete,
  openForceDelete,
}: Props) {
  const { setState, actionAccount, loadData } = useAccountContext();
  const { pushToast } = useToast();

  const users: UserItem[] = data.map(mapUser);

  async function handleAccountAction(
    selected: UserItem,
    mode: "restore",
    successMessage: string
  ) {
    try {
      await actionAccount(selected.UUID, undefined, mode);
      pushToast(successMessage);
      await loadData();
    } catch (error: any) {
      if (!error?.response) {
        pushToast("Server error");
        return;
      }

      const { status, data } = error.response;

      const cf = handleCloudflareError(status);
      if (cf) {
        pushToast(cf);
        return;
      }

      pushToast(data?.message || "Error");
    }
  }

  const getDepartment = (user: UserItem) => {
    if (!isEmpty(user.Prodi)) return user.Prodi;
    if (!isEmpty(user.Fakultas)) return user.Fakultas;
    return "-";
  };

  const getActions = (user: UserItem): ActionItem[] => {
    const deleted = !isEmpty(user.DeletedAt);
    console.log(user)

    if (deleted) {
      return [
        {
          name: "restore",
          icon: "restore",
          className: "hover:text-primary",
          onClick: async () =>
            await handleAccountAction(
              user,
              "restore",
              "Berhasil restore account"
            ),
        },
        {
          name: "force delete",
          icon: "delete_forever",
          className: "hover:text-error",
          onClick: () => openForceDelete(user),
        },
      ];
    }

    return [
      {
        name: "edit",
        icon: "edit",
        className: "hover:text-primary",
        onClick: () => {
          setState((prev: any) => ({
            ...prev,
            selected: user,
          }))
        }
      },
      {
        name: "delete",
        icon: "delete",
        className: "hover:text-error",
        onClick: () => openDelete(user),
      },
    ];
  };

  return (
    <table className="min-w-[700px] w-full text-left border-collapse">
      <thead>
        <tr className="bg-surface-container text-on-surface-variant text-[11px] uppercase tracking-[0.15em] font-bold">
          <th className="px-4 md:px-8 py-4">User Details</th>
          <th className="px-4 md:px-8 py-4">Level</th>
          <th className="px-4 md:px-8 py-4">Department / Unit</th>
          <th className="px-4 md:px-8 py-4 text-right">Actions</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-surface-container-low">
        {loading ? (
          <tr>
            <td
              colSpan={4}
              className="px-4 md:px-8 py-5 text-center text-sm"
            >
              Loading...
            </td>
          </tr>
        ) : users.length === 0 ? (
          <tr>
            <td
              colSpan={4}
              className="px-4 md:px-8 py-5 text-center text-sm"
            >
              No Data
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <tr
              key={user.UUID}
              className="hover:bg-surface-container-low/40 transition-colors"
            >
              <td className="px-4 md:px-8 py-5">
                <p className="text-sm font-bold">{user.Name}</p>
                <small className="text-on-surface-variant">
                  {user.Email || user.Username}
                </small>
              </td>

              <td className="px-4 md:px-8 py-5">
                <Badge>{user.Level}</Badge>
              </td>

              <td className="px-4 md:px-8 py-5 text-sm text-on-surface-variant">
                {getDepartment(user)}
              </td>

              <td className="px-4 md:px-8 py-5 text-right">
                <ActionButtons items={getActions(user)} />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}