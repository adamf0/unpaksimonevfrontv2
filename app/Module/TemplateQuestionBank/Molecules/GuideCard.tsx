import Icon from "../../Common/Components/Atoms/Icon";

export default function GuideCard() {
  return (
    <div className="bg-surface-container-low rounded-xl p-6">
      <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
        <Icon name="info" className="text-primary !text-lg"/>
        Editor Guide
      </h4>
      <ul className="text-xs text-slate-600 space-y-2">
        <li>
          • Use <b>Weights</b> to influence scoring algorithms.
        </li>
        <li>• Radio types are best for single choices.</li>
        <li>• Templates can be duplicated for cycles.</li>
      </ul>
    </div>
  );
}
