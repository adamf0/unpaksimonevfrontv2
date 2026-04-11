import { TemplateItem } from "../Attribut/TemplateItem";

type StatusBadgeProps = {
  item?: TemplateItem;
};
export function StatusState({ item }: StatusBadgeProps) {
  const isDeleted = item?.status === "deleted" || item?.deletedtime;

  const key = isDeleted
    ? "deleted"
    : item?.status === "active"
      ? "active"
      : "draft";

  const STATUS_CONFIG = {
    deleted: {
      label: "Deleted",
      className: "bg-red-100 text-red-700",
    },
    active: {
      label: "Active",
      className: "bg-green-100 text-green-700",
    },
    draft: {
      label: "Draft",
      className: "bg-gray-100 text-gray-700",
    },
  };

  const config = STATUS_CONFIG[key];

  return (
    <span
      className={`px-3 py-1 text-[10px] font-extrabold rounded-full tracking-tight uppercase ${config.className}`}
    >
      {config.label}
    </span>
  );
}
