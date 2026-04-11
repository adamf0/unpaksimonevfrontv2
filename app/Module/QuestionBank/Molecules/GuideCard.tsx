import Card from "../../Common/Components/Atoms/Card";

export function GuideCard() {
  return (
    <Card className="bg-gradient-to-br from-primary to-[#2c2a51] rounded-xl p-8 text-on-primary indigo-shadow relative overflow-hidden group">
       
        <h4 className="font-headline text-lg font-bold mb-6">Panduan Input</h4>
        <ul className="space-y-4 text-white">
          <li className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold shrink-0">
              1
            </div>
            <p className="text-sm leading-snug">
              Gunakan bahasa yang baku dan mudah dimengerti mahasiswa.
            </p>
          </li>
          <li className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold shrink-0">
              2
            </div>
            <p className="text-sm leading-snug">
              Pastikan kategori sesuai agar pelaporan data akurat.
            </p>
          </li>
          <li className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold shrink-0">
              3
            </div>
            <p className="text-sm leading-snug">
              Setiap pertanyaan akan masuk status 'Draft' sebelum diterbitkan.
            </p>
          </li>
        </ul>
    </Card>
  );
}
