export function UserInfo({ name, email }: any) {
  return (
    <div className="flex items-center gap-3 md:gap-4">
      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary">
        {name
          .split(" ")
          .map((n: string) => n[0])
          .join("")}
      </div>
      <div>
        <p className="text-sm font-bold">{name}</p>
        <p className="text-xs text-on-surface-variant">{email}</p>
      </div>
    </div>
  );
}
