export default function Button({
  children,
  className = "bg-primary/10 text-primary text-[10px]",
  ...props
}: any) {
  return (
    <span
      {...props}
      className={`px-3 py-1 font-black uppercase rounded-full tracking-wider ${className}`}
    >
      {children}
    </span>
  );
}
