"use client";

import { useEffect, useRef } from "react";
import { TabButton } from "../Atoms/TabButton";
import { TabValue } from "../Attribut/TabValue";

interface TabsProps {
  value: string;
  onChange: (val: TabValue) => void;
}

export function Tabs({ value, onChange }: TabsProps) {
  const tabListRef = useRef<HTMLButtonElement>(null);
  const tabTreeRef = useRef<HTMLButtonElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const moveIndicator = (el: HTMLElement | null) => {
    if (!el || !indicatorRef.current) return;

    const parentRect = el.parentElement!.getBoundingClientRect();
    const rect = el.getBoundingClientRect();

    indicatorRef.current.style.width = rect.width + "px";
    indicatorRef.current.style.transform = `translateX(${
      rect.left - parentRect.left
    }px)`;
  };

  useEffect(() => {
    moveIndicator(tabListRef.current);
  }, []);

  useEffect(() => {
    moveIndicator(value === "table" ? tabListRef.current : tabTreeRef.current);
  }, [value]);

  return (
    <div className="relative flex border-b border-outline-variant/30 gap-8">
      <div
        ref={indicatorRef}
        className="absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300"
      />

      <TabButton
        innerRef={tabListRef}
        icon="format_list_bulleted"
        label="Table View"
        active={value === "table"}
        onClick={() => onChange("table")}
      />

      <TabButton
        innerRef={tabTreeRef}
        icon="account_tree"
        label="Hierarchy View"
        active={value === "tree"}
        onClick={() => onChange("tree")}
      />
    </div>
  );
}