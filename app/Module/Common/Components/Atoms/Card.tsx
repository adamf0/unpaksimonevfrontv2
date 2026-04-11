export default function Card({ children, className = "" }: any) {
  return (
    <div className={`bg-surface-container-lowest rounded-xl ${className}`}>
      {children}
    </div>
  );
}