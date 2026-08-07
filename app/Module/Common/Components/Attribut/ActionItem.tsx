export type ActionItem = {
  name: string;
  icon: string;
  className?: string;
  onClick: () => void;
  label?: string;
  tooltip?: string;
};