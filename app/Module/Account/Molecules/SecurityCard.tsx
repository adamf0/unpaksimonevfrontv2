import Icon from "../../Common/Components/Atoms/Icon";
import Card from "../../Common/Components/Atoms/Card";

export function SecurityCard() {
  return (
    <Card className="p-6 indigo-shadow space-y-4">
      <h5 className="text-sm font-bold flex items-center gap-2">
        <Icon name="verified_user" className="text-primary !text-lg"/>
        Security Protocol
      </h5>
      <p className="text-xs text-on-surface-variant leading-relaxed">
        User passwords are encrypted using ****** standards. Ensure all
        level-specific permissions follow the principle of least privilege.
      </p>
    </Card>
  );
}