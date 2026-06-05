import { TreeItem } from "../Attribut/TreeItem";
import { FlattenedItem } from "../Attribut/FlattenedItem";

export function flattenTree(
  items: TreeItem[],
  depth = 0,
  parentUuid: string | null = null
): FlattenedItem[] {
  return items.flatMap((item) => [
    {
      uuid: item.uuid,
      name: item.name,
      deletedat: item.deletedat,
      depth,
      parentUuid,
    },
    ...flattenTree(
      item.children ?? [],
      depth + 1,
      item.uuid
    ),
  ]);
}