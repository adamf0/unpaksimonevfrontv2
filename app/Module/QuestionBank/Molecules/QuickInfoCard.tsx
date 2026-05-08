import Icon from "../../Common/Components/Atoms/Icon";
import Card from "../../Common/Components/Atoms/Card";

interface Props {
  data: any[];
  loading: boolean;
}

export function QuickInfoCard({
  data,
  loading = false,
}: Props) {

  if (loading) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-6 indigo-shadow space-y-4 relative overflow-hidden animate-pulse">
        <div className="space-y-3 relative z-10">
          <div className="h-4 w-32 rounded bg-surface-container-high" />
          <div className="h-12 w-24 rounded bg-surface-container-high" />
        </div>

        <div className="absolute -bottom-4 -right-4 h-28 w-28 rounded-full bg-surface-container-high opacity-40" />
      </div>
    );
  }

  return (
    <Card className="p-6 indigo-shadow space-y-4 relative overflow-hidden group">
      <div className="relative z-10">
        <p className="text-sm font-bold text-secondary mb-1">
          Total Bank Soal
        </p>

        <h4 className="text-5xl font-headline font-extrabold text-on-secondary-container">
          {data.length}
        </h4>
      </div>

      <Icon
        name="analytics"
        className="absolute -bottom-4 -right-4 !text-9xl text-secondary-container/40 group-hover:scale-110 transition-transform"
      />
    </Card>
  );
}