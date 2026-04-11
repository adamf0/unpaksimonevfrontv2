"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Option } from "../Common/Components/Attribut/Option";

export function useSelect(props: any) {
  const {
    value,
    options,
    onChange,
    mode,
  } = props;

  const multiple = mode === "multiple";

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const ref = useRef<HTMLDivElement>(null);

  const selected = useMemo<Option[]>(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  const isSelected = (opt: Option) =>
    selected.some((v) => v.value === opt.value);

  const toggle = (opt: Option) => {
    if (!multiple) {
      onChange?.(opt);
      setOpen(false);
      return;
    }

    const exists = isSelected(opt);

    const next = exists
      ? selected.filter((v) => v.value !== opt.value)
      : [...selected, opt];

    onChange?.(next);
  };

  const remove = (opt: Option) => {
    onChange?.(selected.filter((v) => v.value !== opt.value));
  };

  const clear = () => onChange?.(multiple ? [] : null);

  const filtered = useMemo(() => {
    return options.filter((o: Option) =>
      o.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, options]);

  const grouped = useMemo(() => {
    const g: Record<string, Option[]> = {};

    filtered.forEach((o: Option) => {
      const key = o.group || "default";
      if (!g[key]) g[key] = [];
      g[key].push(o);
    });

    return Object.fromEntries(
      Object.entries(g).filter(([_, v]) => v.length > 0)
    );
  }, [filtered]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return {
    ref,
    open,
    setOpen,
    search,
    setSearch,
    selected,
    isSelected,
    toggle,
    remove,
    clear,
    grouped,
  };
}