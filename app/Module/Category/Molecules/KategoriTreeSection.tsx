import { useState } from "react";
import { adaptKategoriToTree } from "../Adapter/adaptKategoriToTree";
import adaptKategoriTreeFlat from "../Adapter/adaptKategoriTreeFlat";
import { TreeItem } from "../Attribut/TreeItem";
import { useCategoryContext } from "../Context/CategoryProvider";
import { TreeView } from "./TreeView";
import KategoriFlat from "../Attribut/KategoriFlat";

export function KategoriTreeSection() {
  const { state } = useCategoryContext();
  const treeData = adaptKategoriToTree(state.source || []);
  const [tree, setTree] = useState<KategoriFlat[]>([]);

  function transformData(data: TreeItem[]) {
    const transform = adaptKategoriTreeFlat(data);
    setTree(transform);
  }
  function handlerUpdate() {
    console.log(tree)
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-6 lg:p-8 group/tree-item">
      <TreeView data={treeData} onChange={(data: TreeItem[]) => transformData(data)} />
      <div className="mt-12 pt-8 border-t border-surface-container flex justify-between items-center">
        <p className="text-sm text-on-surface-variant italic flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">info</span>
          Drag and drop to reorder the hierarchy. Changes must be saved to
          apply.
        </p>
        <button onClick={handlerUpdate} className="bg-gradient-to-r from-primary to-primary-dim text-on-primary font-headline font-extrabold px-10 py-4 rounded-xl shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-3">
          Update Changes
        </button>
      </div>
    </div>
  );
}
