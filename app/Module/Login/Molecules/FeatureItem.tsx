import Icon from "../../Common/Components/Atoms/Icon";

type FeatureItemProps = {
  icon: string;
  label: string;
};

export default function FeatureItem({ icon, label }: FeatureItemProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon name={icon} className="!text-xl"/>
      {label}
    </div>
  );
}