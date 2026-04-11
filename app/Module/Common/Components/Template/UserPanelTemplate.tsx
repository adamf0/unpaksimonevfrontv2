"use client";

export default function UserPanelTemplate({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="antialiased">
      <main className="min-h-screen flex">{children}</main>
    </div>
  );
}
