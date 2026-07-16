export const metadata = {
  title: "Studio",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] overflow-auto bg-white text-black">
      {children}
    </div>
  );
}
