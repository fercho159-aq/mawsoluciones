
// The AuthProvider is now in the root layout, so this file is no longer needed to wrap the children.
// We just pass them through.
export default function EquipoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
