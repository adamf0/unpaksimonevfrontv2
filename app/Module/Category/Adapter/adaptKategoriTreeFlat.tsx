import KategoriFlat from "../Attribut/KategoriFlat";
import { TreeItem } from "../Attribut/TreeItem";

export default function adaptKategoriTreeFlat(
  data: TreeItem[],
  parentUuid: string | null = null,
  parentPath: string = ""
): KategoriFlat[] {
  return data.flatMap((item) => {
    const currentPath = parentPath
      ? `${parentPath} > ${item.name}`
      : item.name;

    const currentNode: KategoriFlat = {
      id: item.id,
      uuid: item.uuid,
      uuidSub: parentUuid,
      full_text: currentPath,
    };

    return [
      currentNode,
      ...adaptKategoriTreeFlat(
        item.children ?? [],
        item.uuid,
        currentPath
      ),
    ];
  });
}