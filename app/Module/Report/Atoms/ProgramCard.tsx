export default function ProgramCard({
  title,
  total,
  percent,
}: {
  title: string;
  total: string;
  percent: string;
}) {
  return (
    <div className="bg-surface-container-lowest p-4 rounded-2xl border border-indigo-50">
      <p className="text-xs font-bold text-indigo-300 uppercase">
        {title}
      </p>

      <div className="flex justify-between items-end mt-2">
        <span className="text-2xl font-black text-indigo-900">
          {total}
        </span>

        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
          {percent}
        </span>
      </div>
    </div>
  );
}