"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import Icon from "../../Common/Components/Atoms/Icon";

interface Props {
  item: {
    uuid: string;
    name: string;
    depth: number;
  };
}

const INDENT = 40;

export default function TreeRow({ item }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.uuid,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative cursor-grab select-none"
    >
      {/* Vertical Lines */}
      {item.depth > 0 &&
        Array.from({
          length: item.depth,
        }).map((_, level) => (
          <div
            key={`v-${level}`}
            className="absolute top-0 bottom-0 border-l-2 border-surface-container-high pointer-events-none"
            style={{
              left: level * INDENT + INDENT / 2,
            }}
          />
        ))}

      {/* Horizontal Connector */}
      {item.depth > 0 && (
        <div
          className="absolute border-t-2 border-surface-container-high pointer-events-none"
          style={{
            width: INDENT / 2,
            left: item.depth * INDENT - INDENT / 2,
            top: "50%",
          }}
        />
      )}

      {/* Content */}
      <div
        style={{
          marginLeft: item.depth * INDENT,
        }}
        className={`
    flex
    items-center
    justify-between
    p-4
    rounded-xl
    border-l-4
    transition-all
    ${
      item.depth === 0
        ? `
          bg-red-500/40
          border-red-800
          text-black
          hover:bg-red-500/60
        `
        : `
          bg-surface-container-low
          border-primary
          hover:bg-surface-container-high
        `
    }
  `}
      >
        <div className="flex items-center gap-3">
          <Icon name="drag_indicator" className={item.depth === 0? "text-black":"text-outline-variant"} />

          <Icon name="folder_open" />

          <span className="font-bold">{item.name}</span>
        </div>
      </div>
    </div>
  );
}
