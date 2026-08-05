import Icon from "../../Common/Components/Atoms/Icon";

type CardProps = {
  title: string;
  value: string | number;
  icon: string;
  badge?: string;
  badgeClass?: string;
  iconClass?: string;
  subtitle?: string;
};

export default function Card({
  title,
  value,
  icon,
  badge = "Steady",
  badgeClass = "bg-surface-container text-on-surface-variant",
  iconClass = "bg-primary-container/20 text-primary",
  subtitle,
}: CardProps) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_12px_32px_-4px_rgba(44,42,81,0.06)] border border-outline-variant/10 flex flex-col justify-between gap-4 group hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${iconClass}`}>
          <Icon name={icon} />
        </div>
        {badge && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeClass}`}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-on-surface-variant font-medium">{title}</p>
        <p className="editorial-headline text-3xl font-extrabold text-on-surface mt-1">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-on-surface-variant/70 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
