"use client";

import Icon from "../../Common/Components/Atoms/Icon";
import { TreeItem } from "../Attribut/TreeItem";

export function TreeNode({ item }: { item: TreeItem }) {
  return (
    <div className="group/tree-item" data-id={item.id} data-uuid={item.uuid} data-name={item.name}>
      {/* NODE */}
      <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border-l-4 border-primary hover:bg-surface-container-high transition-all">
        {/* LEFT */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Icon
            name="drag_indicator"
            className="drag-handle cursor-move text-outline-variant"
          />
          <Icon name={item.type === "file" ? "description" : "folder_open"} />
          <span className="font-bold">{item.name}</span>
        </div>

        {/* ACTION */}
        <div className="flex gap-2 opacity-0 group-hover/tree-item:opacity-100 transition-opacity">
          <button className="hover:text-primary">
            <Icon name="edit" />
          </button>
          <button className="hover:text-error">
            <Icon name="delete" />
          </button>
        </div>
      </div>

      {/* 🔥 WAJIB ADA UNTUK N LEVEL */}
      <div className="ml-6 sm:ml-12 mt-2 space-y-2 border-l-2 border-surface-container-high pl-4 sm:pl-8 child-sort min-h-[20px]">
        {item.children?.map((child) => (
          <TreeNode key={child.id} item={child} />
        ))}
      </div>
    </div>
  );
}
