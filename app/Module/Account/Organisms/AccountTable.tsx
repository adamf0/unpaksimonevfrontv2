"use client";

import { UserInfo } from "../Molecules/UserInfo";
import { ActionButtons } from "../../Common/Components/Molecules/ActionButtons";
import Badge from "../../Common/Components/Atoms/Badge";
import { ActionItem } from "../../Common/Components/Attribut/ActionItem";
import { UserItem } from "../Attribut/UserItem";

export function AccountTable({
  onEditClick,
  onDeleteClick,
}: {
  onEditClick: (user: UserItem) => void;
  onDeleteClick: (user: UserItem) => void;
}) {
  const users: UserItem[] = [
    {
      id: 1,
      name: "asa",
      email: "asasa",
      level: "Admin",
      department: "Central Administration",
    },
    {
      id: 2,
      name: "budi",
      email: "budi@mail.com",
      level: "Operator",
      department: "Faculty of Engineering",
    },
  ];

  const getActions = (user: UserItem): ActionItem[] => [
    {
      name: "edit",
      icon: "edit",
      className: "hover:text-primary",
      onClick: () => {
        console.log("edit", user)
        onEditClick(user)
      },
    },
    {
      name: "delete",
      icon: "delete",
      className: "hover:text-error",
      onClick: () => {
        console.log("delete", user)
        onDeleteClick(user);
      },
    },
  ];

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
        {users.map((user) => (
          <tr
            key={user.id}
            className="hover:bg-surface-container-low/40 transition-colors"
          >
            <td className="px-4 md:px-8 py-5">
              <UserInfo name={user.name} email={user.email} />
            </td>

            <td className="px-4 md:px-8 py-5">
              <Badge>{user.level}</Badge>
            </td>

            <td className="px-4 md:px-8 py-5 text-sm text-on-surface-variant">
              {user.department}
            </td>

            <td className="px-4 md:px-8 py-5 text-right">
              <ActionButtons items={getActions(user)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}