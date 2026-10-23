import { Routes, Route } from 'react-router-dom'
import Navbar from "./Navbar";
import Footer from "./Footer.jsx";
import Home from "./Home.jsx";
import Productos from './Productos.jsx';
import Nosotros from './Nosotros.jsx';
import Contacto from './Contacto.jsx';
import NotFound from './NotFound.jsx';

function App() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <main className='flex-1 wfull px-6 py-10'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Productos' element={<Productos />} />
          <Route path='/Nosotros' element={<Nosotros />} />
          <Route path='/Contacto' element={<Contacto />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </main>
  );
}

export default App;