import Card from "../../Common/Components/Atoms/Card";

export function SubCategoryCard() {
  return (
    <Card className="p-6 indigo-shadow space-y-4">
      <p className="text-primary-container font-bold text-xs uppercase tracking-widest mb-4">
          Live Sub Kategori
        </p>
        <h4 className="text-5xl font-black mb-4">124</h4>
        <p className="text-lg font-medium leading-tight opacity-90">
          Total Access: 124 Active administrative users across all departments.
        </p>
    </Card>
  );
}