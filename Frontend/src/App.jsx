import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";

import Navbar from './components/Navbar'
import ProductList from './components/Products/ProductList'
import ProductDetail from './components/Products/ProductDetail'
import Cart from './components/Products/Cart'
import Checkout from './components/Products/Checkout'



function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* <Route path="/login" element={<Authintication />} />
        <Route path="/details" element={<OurPrograms/>}/>
        <Route path="/programslist" element={<ProgramsList/>}/>        
        <Route path="/program/:id" element={<ProgramOne />} />
        <Route path="/Blogs" element={<Blogs />} />
        <Route path="/ProductList" element={<ProductList />} />
        <Route path="/ProductDetail" element={<ProductDetail />} /> */}
        
            <Route path="/ProductList" element={<ProductList />} />
            <Route path="/product/:name" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/Checkout" element={<Checkout/>} />


            {/* Add more routes as needed */}
      </Routes>
      <Footer/>
    </Router>
  )
}

export default App;
