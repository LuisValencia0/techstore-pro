import { Link, useLocation } from 'react-router-dom'

function Navbar() {
    const ubicacion = useLocation()
    return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 rounded-2xl">
        <div className="text-xl font-extrabold text-verde">
          TechStore Pro
        </div>
        <ul className="hidden md:flex gap-6 text-sm font-semibold text-texto-dim">
          <li>
            <Link
             to ="/"
             className={ubicacion.pathname === "/" ? "text-verde font-extrabold" : ""}
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
             to ="/Productos"
             className={ubicacion.pathname === "/Productos" ? "text-verde font-extrabold" : ""}
            >
              Productos
            </Link>
          </li>
          <li>Nosotros</li>
          <li>Contacto</li>
        </ul>
        <button className="bg-verde text-white py-2 px-5 rounded-lg font-bold text-sm">
          Ingresar
        </button>
      </nav>
    )
}

export default Navbar 