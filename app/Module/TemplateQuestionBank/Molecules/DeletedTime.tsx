"use client";

import { useEffect, useState } from "react";
import { TemplateItem } from "../Attribut/TemplateItem";

import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";

type DeletedTimeProps = {
  item?: TemplateItem;
};

export function DeletedTime({ item }: DeletedTimeProps) {
  const [label, setLabel] = useState("");
  const [open, setOpen] = useState(false);

  const deletedDate = item?.deletedtime
    ? new Date(item.deletedtime as any)
    : null;

  const {
    refs,
    floatingStyles,
  } = useFloating({
    open,
    whileElementsMounted: autoUpdate,
    placement: "top",
    middleware: [offset(10), flip(), shift({ padding: 8 })],
  });

  useEffect(() => {
    if (!item?.deletedtime) return;

    const updateTime = () => {
      const deletedAt = new Date(item.deletedtime as any).getTime();
      const now = Date.now();

      const diff = Math.floor((now - deletedAt) / 1000);

      if (diff < 60) {
        setLabel(`${diff} second`);
        return;
      }

      if (diff < 3600) {
        setLabel(`${Math.floor(diff / 60)} minute`);
        return;
      }

      if (diff < 86400) {
        setLabel(`${Math.floor(diff / 3600)} hour`);
        return;
      }

      if (diff < 2592000) {
        setLabel(`${Math.floor(diff / 86400)} day`);
        return;
      }

      if (diff < 31536000) {
        setLabel(`${Math.floor(diff / 2592000)} month`);
        return;
      }

      setLabel(`${Math.floor(diff / 31536000)} year`);
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [item?.deletedtime]);

  if (!item?.deletedtime || !deletedDate) return null;

  const fullDate = deletedDate.toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <>
      <span
        ref={refs.setReference}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="px-3 py-1 text-[10px] font-extrabold rounded-full tracking-tight uppercase bg-red-50 text-red-700 border border-red-200 cursor-pointer"
      >
        Deleted {label}
      </span>

      {open && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="z-50 px-3 py-2 text-xs font-semibold rounded-xl shadow-xl bg-slate-900 text-white whitespace-nowrap"
        >
          {fullDate}
        </div>
      )}
    </>
  );
}