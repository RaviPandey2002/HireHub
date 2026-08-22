export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main>
  );
}
