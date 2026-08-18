export function SelectOptionIndicator({
  selected,
}: {
  selected: boolean;
}) {
  return (
    <div className="flex items-center justify-center">
      {selected && (
        <span className="material-symbols-outlined text-primary text-lg font-bold">
          check
        </span>
      )}
    </div>
  );
}