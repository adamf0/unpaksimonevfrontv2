import Card from "../../Common/Components/Atoms/Card";
import { useCategoryContext } from "../Context/CategoryProvider";

export function SubCategoryCard() {
  const { state } = useCategoryContext();
  const totalUniqueNamaSubKategori = new Set(
    state.data
      .filter(
        (item: any) =>
          item.NamaSubKategori && item.NamaSubKategori.trim() !== "",
      )
      .map((item: any) => item.NamaSubKategori),
  ).size;

  return (
    <Card className="p-6 indigo-shadow space-y-4">
      <p className="text-primary-container font-bold text-xs uppercase tracking-widest mb-4">
        Total Sub Kategori
      </p>
      <h4 className="text-5xl font-black mb-4">{totalUniqueNamaSubKategori}</h4>
      <p className="text-lg font-medium leading-tight opacity-90">
        Jumlah sub kategori aktif yang digunakan dalam pengelompokan data
        evaluasi dan monitoring.
      </p>
    </Card>
  );
}
