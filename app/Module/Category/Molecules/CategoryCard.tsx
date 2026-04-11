import Card from "../../Common/Components/Atoms/Card";

export function CategoryCard() {
  return (
    <Card className="bg-gradient-to-br from-primary to-[#2c2a51] rounded-xl p-8 text-on-primary indigo-shadow relative overflow-hidden group">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      <div className="relative z-10">
        <p className="text-primary-container font-bold text-xs uppercase tracking-widest mb-4">
          Live Kategori
        </p>
        <h4 className="text-5xl font-black mb-4">124</h4>
        <p className="text-lg font-medium leading-tight opacity-90">
          Total Access: 124 Active administrative users across all departments.
        </p>
      </div>
    </Card>
  );
}
