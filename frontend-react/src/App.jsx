function App() {
  return (
    <>
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
        <div className="text-xl font-extrabold text-verde">
          TechStore Pro
        </div>
        <ul className="flex gap-6 text-sm font-semibold text-texto-dim">
          <li>Inicio</li>
          <li>Productos</li>
          <li>Nosotros</li>
          <li>Contacto</li>
        </ul>
        <button className="bg-verde text-white py-2 px-5 rounded-lg font-bold text-sm">
          Ingresar
        </button>
      </nav>

      <div className="p-8 flex flex-col items-center gap-6"> {/* ← NUEVO */}
        <div className="flex flex-col gap-2 p-4 rounded-xl shadow-md max-w-xs">
          <img src="https://placehold.co/300x200" className="rounded-lg" />
          <h3 className="font-bold text-lg">Mouse Inalámbrico</h3>
          <p className="text-verde font-extrabold">$89.900</p>
        </div>

        <button className="bg-transparent text-verde border-2 border-verde py-3 px-6 rounded-xl font-bold">
          Ver más detalles
        </button>
      </div> 
      
      <footer className="flex justify-between items-center p-6 bg-texto text-white">
        <p>© 2026 TechStore Pro</p>
        <p className="text-sm">Hecho con Tailwind CSS</p>
      </footer>
    </>
  )
}

export default App