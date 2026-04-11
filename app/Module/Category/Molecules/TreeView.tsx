"use client";

import { useEffect, useRef } from "react";
import Sortable from "sortablejs";
import { TreeItem } from "../Attribut/TreeItem";
import { TreeNode } from "./TreeNode";

interface TreeViewProps {
  data: TreeItem[];
}

export function TreeView({ data }: TreeViewProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sortablesRef = useRef<Sortable[]>([]); // 🔥 simpan semua instance

  useEffect(() => {
    if (!rootRef.current) return;

    const root = rootRef.current;

    const sortableConfig: Sortable.Options = {
      animation: 150,
      handle: ".drag-handle",
      draggable: ".group\\/tree-item", // 🔥 penting (escape slash)
      ghostClass: "opacity-50",

      group: {
        name: "nested",
        pull: true,
        put: true,
      },

      fallbackOnBody: true,
      swapThreshold: 0.65,
      invertSwap: true,
      fallbackTolerance: 5,
      dragoverBubble: true, // 🔥 penting untuk deep nesting
    };

    // 🔥 CLEAR OLD INSTANCES
    sortablesRef.current.forEach((s) => {
      if (s && typeof s.destroy === "function") {
        try {
          s.destroy();
        } catch (e) {
          console.warn("Sortable destroy error:", e);
        }
      }
    });
    sortablesRef.current = [];

    // 🔥 INIT FUNCTION (RECURSIVE SAFE)
    const initSortable = (container: HTMLElement) => {
      const sortable = new Sortable(container, {
        ...sortableConfig,
        onAdd(evt) {
          const parent = evt.to;
          parent.appendChild(evt.item);
        },
      });

      sortablesRef.current.push(sortable);
    };

    // 🔥 INIT ROOT
    initSortable(root);

    // 🔥 INIT ALL CHILD SORT
    const initAll = () => {
      root.querySelectorAll(".child-sort").forEach((el) => {
        const htmlEl = el as HTMLElement;

        if (htmlEl.dataset.sortableInit) return;

        htmlEl.dataset.sortableInit = "1";
        initSortable(htmlEl);
      });
    };

    initAll();

    // 🔥 OBSERVER (CRITICAL FOR N LEVEL)
    const observer = new MutationObserver(() => {
      initAll();
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
    });

    return () => {
      sortablesRef.current.forEach((s) => s.destroy());
      observer.disconnect();
    };
  }, [data]);

  return (
    <div ref={rootRef} className="space-y-2">
      {data.map((item) => (
        <TreeNode key={item.id} item={item} />
      ))}
    </div>
  );
}
