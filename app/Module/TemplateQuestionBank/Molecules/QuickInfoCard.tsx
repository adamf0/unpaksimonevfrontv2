import Icon from "../../Common/Components/Atoms/Icon";
import Card from "../../Common/Components/Atoms/Card";

export function QuickInfoCard() {
  return (
    <Card className="p-6 shadow-[0_12px_32px_-4px_rgba(44,42,81,0.06)] relative overflow-hidden">
      <div className="absolute -right-4 -top-4 opacity-5">
        <Icon name="analytics" className="text-[120px]" />
      </div>
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">
        Quick Stats
      </h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-extrabold text-indigo-900 leading-none">
              42
            </p>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Total Questions
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
            <Icon name="inventory_2" className="text-[120px]" />
          </div>
        </div>
      </div>
    </Card>
  );
}
