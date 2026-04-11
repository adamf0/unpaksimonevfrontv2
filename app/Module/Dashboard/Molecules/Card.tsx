import Icon from "../../Common/Components/Atoms/Icon";

export default function Card({ title, value, icon }: any) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_12px_32px_-4px_rgba(44,42,81,0.06)] flex flex-col gap-4 group hover:translate-y-[-4px] transition-transform duration-300">
      <div className="flex justify-between items-start">
        <div className="p-3 bg-primary-container/20 rounded-xl text-primary">
          <Icon name={icon} />
        </div>
        <span className="text-xs font-bold text-on-surface-variant bg-surface-container px-2 py-1 rounded-full">
          Steady
        </span>
      </div>
      <div>
        <p className="text-sm text-on-surface-variant font-medium">{title}</p>
        <p className="editorial-headline text-4xl font-extrabold text-on-surface mt-1">
          {value}
        </p>
      </div>
    </div>
  );
}
