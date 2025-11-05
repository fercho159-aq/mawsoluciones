// Por ahora, este layout es un simple contenedor.
// En el futuro, contendrá la barra lateral de navegación y la lógica de protección de rutas.

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Aquí irá la barra lateral de navegación del dashboard */}
      <aside className="w-64 bg-card p-4 border-r">
        <h2 className="text-xl font-bold font-headline mb-8">Equipo Interno</h2>
        <nav>
          {/* Los enlaces a las diferentes secciones irán aquí */}
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-background">
        {children}
      </main>
    </div>
  );
}