// molecules/SelectDropdownItem.tsx
import clsx from "clsx";
import { Option } from "../Attribut/Option";
import { SelectOptionIndicator } from "../Atoms/SelectOptionIndicator";

export function SelectDropdownItem({
  option,
  selected,
  onClick,
  renderItem,
}: {
  option: Option;
  selected: boolean;
  onClick: () => void;
  renderItem?: (opt: Option, selected: boolean) => React.ReactNode;
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "px-3 py-2 cursor-pointer hover:bg-surface-container-high",
        selected && "bg-primary/10"
      )}
    >
      {renderItem ? (
        renderItem(option, selected)
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {option.icon}
            <span>{option.label}</span>
          </div>

          <SelectOptionIndicator selected={selected} />
        </div>
      )}
    </div>
  );
}