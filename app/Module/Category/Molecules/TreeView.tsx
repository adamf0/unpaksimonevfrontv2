"use client";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragMoveEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { TreeItem } from "../Attribut/TreeItem";
import { FlattenedItem } from "../Attribut/FlattenedItem";

import TreeRow from "./TreeRow";
import { flattenTree } from "../Hook/flattenTree";
import { buildTree } from "../Hook/buildTree";

interface Props {
  data: TreeItem[];
  onChange?: (
    tree: TreeItem[]
  ) => void;
}

export function TreeView({
  data,
  onChange,
}: Props) {
  const initial =
    useMemo(
      () => flattenTree(data),
      [data]
    );

  const [
    items,
    setItems,
  ] = useState<
    FlattenedItem[]
  >(initial);

  const [
    offsetX,
    setOffsetX,
  ] = useState(0);

  useEffect(() => {
    setItems(
      flattenTree(data)
    );
  }, [data]);

  function rebuildParent(
    list: FlattenedItem[]
  ) {
    const stack: string[] =
      [];

    list.forEach((item) => {
      stack.length =
        item.depth;

      item.parentUuid =
        stack[
          item.depth - 1
        ] ?? null;

      stack[
        item.depth
      ] = item.uuid;
    });

    return list;
  }

  function handleMove(
    event: DragMoveEvent
  ) {
    setOffsetX(
      event.delta.x
    );
  }

  function handleEnd(
    event: DragEndEvent
  ) {
    const {
      active,
      over,
    } = event;

    if (!over) {
      return;
    }

    const oldIndex =
      items.findIndex(
        (x) =>
          x.uuid ===
          active.id
      );

    const newIndex =
      items.findIndex(
        (x) =>
          x.uuid ===
          over.id
      );

    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {
      return;
    }

    const moved =
      arrayMove(
        items,
        oldIndex,
        newIndex
      );

    const current =
      moved[newIndex];

    const previous =
      moved[newIndex - 1];

    let depth =
      previous?.depth ?? 0;

    if (offsetX > 40) {
      depth++;
    }

    if (offsetX < -40) {
      depth--;
    }

    depth = Math.max(
      0,
      depth
    );

    current.depth =
      depth;

    rebuildParent(
      moved
    );

    setItems(moved);

    const tree =
      buildTree(moved);

    onChange?.(tree);

    setOffsetX(0);
  }

  return (
    <DndContext
      collisionDetection={
        closestCenter
      }
      onDragMove={
        handleMove
      }
      onDragEnd={
        handleEnd
      }
    >
      <SortableContext
        items={items.map(
          (x) => x.uuid
        )}
        strategy={
          verticalListSortingStrategy
        }
      >
        <div className="space-y-2">
          {items.map(
            (item) => (
              <TreeRow
                key={
                  item.uuid
                }
                item={
                  item
                }
              />
            )
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}