export default function NavBarItemMobile({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`flex-1 flex flex-col items-center justify-center py-2 ${
        active ? "text-white bg-indigo-600 rounded-xl" : "text-slate-400"
      }`}
    >
      <span className="text-[10px] font-medium truncate">{label}</span>
    </a>
  );
}