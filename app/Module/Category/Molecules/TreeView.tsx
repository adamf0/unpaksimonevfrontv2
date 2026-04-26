"use client";

import { useEffect, useRef } from "react";
import Sortable from "sortablejs";
import { TreeItem } from "../Attribut/TreeItem";
import { TreeNode } from "./TreeNode";

interface TreeViewProps {
  data: TreeItem[];
  onChange?: (data: TreeItem[]) => void;
}

export function TreeView({ data, onChange }: TreeViewProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sortablesRef = useRef<Sortable[]>([]);

  useEffect(() => {
    if (!rootRef.current) return;

    const root = rootRef.current;

    // 🔥 BUILD TREE FROM DOM
    const buildTreeFromDOM = (container: HTMLElement): TreeItem[] => {
      const items: TreeItem[] = [];

      const children = container.querySelectorAll(
        ":scope > .group\\/tree-item",
      );

      children.forEach((el) => {
        const htmlEl = el as HTMLElement;

        const id = htmlEl.dataset.id || "";
        const uuid = htmlEl.dataset.uuid || "";
        const name = htmlEl.dataset.name || "";

        const childContainer = htmlEl.querySelector(
          ":scope > .child-sort",
        ) as HTMLElement | null;

        const childrenNodes = childContainer
          ? childContainer.querySelectorAll(":scope > .group\\/tree-item")
          : [];

        const hasChildren = childrenNodes.length > 0;

        const node: TreeItem = {
          id,
          uuid,
          name,
          type: hasChildren ? "folder" : "file",
          children: hasChildren ? buildTreeFromDOM(childContainer!) : [],
        };

        items.push(node);
      });

      return items;
    };

    const sortableConfig: Sortable.Options = {
      animation: 150,
      handle: ".drag-handle",
      draggable: ".group\\/tree-item",
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
      dragoverBubble: true,

      // 🔥 ON CHANGE
      onEnd: () => {
        if (!rootRef.current) return;

        const newTree = buildTreeFromDOM(rootRef.current);
        console.log("NEW TREE:", newTree);

        onChange?.(newTree);
      },
    };

    // 🔥 SAFE DESTROY
    sortablesRef.current.forEach((s) => {
      try {
        if (s?.el && document.body.contains(s.el)) {
          s.destroy();
        }
      } catch {}
    });

    sortablesRef.current = [];

    // 🔥 INIT
    const initSortable = (container: HTMLElement) => {
      const sortable = new Sortable(container, sortableConfig);
      sortablesRef.current.push(sortable);
    };

    initSortable(root);

    root.querySelectorAll(".child-sort").forEach((el) => {
      initSortable(el as HTMLElement);
    });

    return () => {
      sortablesRef.current.forEach((s) => {
        try {
          if (s?.el && document.body.contains(s.el)) {
            s.destroy();
          }
        } catch {}
      });

      sortablesRef.current = [];
    };
  }, [data]);

  return (
    <div ref={rootRef} className="space-y-2">
      {data.map((item) => (
        <TreeNode key={item.uuid} item={item} />
      ))}
    </div>
  );
}
