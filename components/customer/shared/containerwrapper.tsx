export default function ContainerWrapper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm p-6 ${className ?? ""}`}
    >
      {children}
    </div>
  );
};