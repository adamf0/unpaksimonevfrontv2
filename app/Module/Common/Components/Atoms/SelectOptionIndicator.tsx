export function SelectOptionIndicator({
  selected,
}: {
  selected: boolean;
}) {
  return (
    <div className="w-4 h-4 rounded-full border flex items-center justify-center">
      {selected && <div className="w-2 h-2 bg-primary rounded-full" />}
    </div>
  );
}