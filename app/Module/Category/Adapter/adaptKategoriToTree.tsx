import { TreeItem } from "../Attribut/TreeItem";

export function adaptKategoriToTree(data: any[]): TreeItem[] {
  const map = new Map<string, TreeItem>();
  const roots: TreeItem[] = [];

  for (const item of data) {
    map.set(item.UUID, {
      deletedat: item.DeletedAt,
      uuid: item.UUID,
      name: item.NamaKategori,
      type: "folder",
      children: [],
    });
  }

  for (const item of data) {
    const node = map.get(item.UUID);

    if (!node) continue;

    if (item.UuidSubKategori) {
      const parent = map.get(item.UuidSubKategori);

      if (parent) {
        parent.children?.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  return roots;
}