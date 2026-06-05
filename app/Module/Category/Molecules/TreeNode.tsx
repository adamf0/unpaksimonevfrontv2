"use client";

import {
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import { CSS } from "@dnd-kit/utilities";

import Icon from "../../Common/Components/Atoms/Icon";
import { TreeItem } from "../Attribut/TreeItem";

interface Props {
  item: TreeItem;
}

export function TreeNode({
  item,
}: Props) {
  const draggable =
    useDraggable({
      id: item.uuid,
    });

  const droppable =
    useDroppable({
      id: item.uuid,
    });

  const style = {
    transform: CSS.Translate.toString(
      draggable.transform
    ),
  };

  return (
    <div
      ref={droppable.setNodeRef}
      className="group/tree-item"
    >
      <div
        ref={draggable.setNodeRef}
        style={style}
        {...draggable.listeners}
        {...draggable.attributes}
        className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border-l-4 border-primary hover:bg-surface-container-high transition-all"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <Icon
            name="drag_indicator"
            className="cursor-move text-outline-variant"
          />

          <Icon
            name={
              item.children?.length
                ? "folder_open"
                : "description"
            }
          />

          <span className="font-bold">
            {item.name}
          </span>
        </div>
      </div>

      <div className="ml-6 sm:ml-12 mt-2 space-y-2 border-l-2 border-surface-container-high pl-4 sm:pl-8 min-h-[20px]">
        {item.children?.map(
          (child) => (
            <TreeNode
              key={child.uuid}
              item={child}
            />
          )
        )}
      </div>
    </div>
  );
}