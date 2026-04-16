import { TreeItem } from "../Attribut/TreeItem";

export function adaptKategoriToTree(data: any[]): TreeItem[] {
  const map = new Map<string, TreeItem>();
  const roots: TreeItem[] = [];

  // STEP 1
  for (const item of data) {
    map.set(String(item.ID), {
      id: String(item.ID),
      uuid: item.UUID,
      name: item.NamaKategori,
      type: "folder",
      children: [],
    });
  }

  // STEP 2
  for (const item of data) {
    const node = map.get(String(item.ID));
    if (!node) continue;

    if (item.IdSubKategori) {
      const parent = map.get(String(item.IdSubKategori));

      if (parent) {
        parent.children?.push(node);
      } else {
        // 🔥 fallback kalau parent tidak ditemukan
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  return roots;
}