import Button from "../Atoms/Button";
import Icon from "../Atoms/Icon";
import { ActionItem } from "../Attribut/ActionItem";

interface ActionButtonsProps {
  items?: ActionItem[];
}

export function ActionButtons({ items = [] }: ActionButtonsProps) {
  return (
    <>
      {items.map((action, index) => (
        <Button
          key={`${action.name}-${index}`}
          onClick={action.onClick}
          className={`p-2 text-outline transition-colors ${action.className ?? ""}`}
        >
          <Icon name={action.icon} className="!text-lg" />
        </Button>
      ))}
    </>
  );
}
