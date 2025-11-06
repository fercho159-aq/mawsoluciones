
import { AuthProvider } from "@/lib/auth-provider";

export default function EquipoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <AuthProvider>
        {children}
      </AuthProvider>
  );
}
