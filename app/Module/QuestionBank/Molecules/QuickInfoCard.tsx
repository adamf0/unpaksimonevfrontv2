import Icon from "../../Common/Components/Atoms/Icon";
import Card from "../../Common/Components/Atoms/Card";

export function QuickInfoCard() {
  return (
    <Card className="p-6 indigo-shadow space-y-4 relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-sm font-bold text-secondary mb-1">Total Pertanyaan</p>
          <h4 className="text-5xl font-headline font-extrabold text-on-secondary-container">
            128
          </h4>
        </div>
        <Icon name="analytics" className="absolute -bottom-4 -right-4 !text-9xl text-secondary-container/40 group-hover:scale-110 transition-transform"/>
    </Card>
  );
}
