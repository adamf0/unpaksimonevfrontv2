export default function OptionSkeleton() {
  return (
    <div className="flex gap-4 items-center animate-pulse">
      <span className="w-6 h-3 bg-slate-200 rounded" />

      <div className="flex-1">
        <div className="h-10 bg-surface-container-low rounded-lg shimmer" />
      </div>

      <div className="w-6 h-6 bg-slate-200 rounded-full" />
    </div>
  );
}
