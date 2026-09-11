export function SelectOptionIndicator({
  selected,
}: {
  selected: boolean;
}) {
  return (
    <div className="flex items-center justify-center shrink-0">
      {selected && (
        <span className="material-symbols-outlined text-primary text-lg font-bold leading-none shrink-0">
          check
        </span>
      )}
    </div>
  );
}