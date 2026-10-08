import Navbar from "./Navbar.jsx"
import Footer from "./Footer.jsx"
import ProductCard from "./ProductCard.jsx"

const productos = [
  {
    nombre: "Mouse Inalámbrico",
    descripcion: "Mouse ergonómico, conexión Bluetooth",
    precio: "$89.900",
    imagen: "https://m.media-amazon.com/images/I/61gzBfXmXXL.jpg",
    stock: 12
  },
  {
    nombre: "Teclado Mecánico",
    descripcion: "Switches azules, retroiluminado RGB",
    precio: "$149.900",
    imagen: "https://media.pichau.com.br/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/k/5/k565r-2-pt-blue2.jpg",
    stock: 14
  },
  {
    nombre: "Monitor 24``",
    descripcion: "Full HD, 75Hz, panel IPS",
    precio: "$899.900",
    imagen: "https://reset.net.co/wp-content/uploads/2023/07/Monitor-24-75hz-IPS-FHD.png",
    stock: 9
  },
  {
    nombre: "Audífonos Bluetooth",
    descripcion: "Cancelacion de ruido, 20h de bateria",
    precio: "$199.900",
    imagen: "https://www.cdctecno.cl/6458-large_default/audifonos-inalambricos-bluetooth-tws-in-ear-soleil-20hrs-borofone-bw71.jpg",
    stock: 5
  },
  ]


function App() {
  return (
  <main className="bg-gradient-to-br from-blue-400 to-purple-700
 min-h-screen max-w-6xl mx-auto px-6 py-10 flex flex-col justify-between gap-10">
      
      <Navbar />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((p) => (
          <ProductCard
          key={p.nombre}
          nombre={p.nombre}
          descripcion={p.descripcion}
          precio={p.precio}
          imagen={p.imagen}
          stock={p.stock}
          />
        ))}
      </section>

      <Footer />

  </main>
  )
}

export default App