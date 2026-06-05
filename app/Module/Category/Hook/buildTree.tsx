import { TreeItem } from "../Attribut/TreeItem";
import { FlattenedItem } from "../Attribut/FlattenedItem";

export function buildTree(
  items: FlattenedItem[]
): TreeItem[] {
  const map = new Map<string, TreeItem>();

  items.forEach((item) => {
    map.set(item.uuid, {
      uuid: item.uuid,
      name: item.name,
      deletedat: item.deletedat,
      children: [],
    });
  });

  const roots: TreeItem[] = [];

  items.forEach((item) => {
    const node = map.get(item.uuid)!;

    if (
      item.parentUuid &&
      map.has(item.parentUuid)
    ) {
      map
        .get(item.parentUuid)!
        .children!.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}