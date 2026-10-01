function ProductCard() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {/* Tarjeta 1 */}
      <div className="flex flex-col gap-2 p-4 rounded-xl shadow-md bg-white">
        <img src="https://m.media-amazon.com/images/I/61gzBfXmXXL.jpg" className="rounded-lg" />
        <h3 className="font-bold text-lg">Mouse Inalámbrico</h3>
        <p className="text-texto-dim text-sm">Mouse ergonómico, conexión Bluetooth</p>
        <p className="text-verde font-extrabold">$89.900</p>
      </div>

      {/* Tarjeta 2 */}
      <div className="flex flex-col gap-2 p-4 rounded-xl shadow-md bg-white">
        <img src="https://media.pichau.com.br/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/k/5/k565r-2-pt-blue2.jpg" className="rounded-lg" />
        <h3 className="font-bold text-lg">Teclado Mecánico</h3>
        <p className="text-texto-dim text-sm">Switches azules, retroiluminado RGB</p>
        <p className="text-verde font-extrabold">$149.900</p>
      </div>

      {/* Tarjeta 3 */}
      <div className="flex flex-col gap-2 p-4 rounded-xl shadow-md bg-white">
        <img src="https://reset.net.co/wp-content/uploads/2023/07/Monitor-24-75hz-IPS-FHD.png" className="rounded-lg" />
        <h3 className="font-bold text-lg">Monitor 24"</h3>
        <p className="text-texto-dim text-sm">Full HD, 75Hz, panel IPS</p>
        <p className="text-verde font-extrabold">$899.900</p>
      </div>

      {/* Tarjeta 4 */}
      <div className="flex flex-col gap-2 p-4 rounded-xl shadow-md bg-white">
        <img src="https://www.cdctecno.cl/6458-large_default/audifonos-inalambricos-bluetooth-tws-in-ear-soleil-20hrs-borofone-bw71.jpg" className="rounded-lg" />
        <h3 className="font-bold text-lg">Audífonos Bluetooth"</h3>
        <p className="text-texto-dim text-sm">Cancelacion de ruido, 20h de bateria</p>
        <p className="text-verde font-extrabold">$199.900</p>
      </div>

    </section>
  )
}

export default ProductCard