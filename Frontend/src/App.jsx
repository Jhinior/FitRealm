import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import ProgramsList from "./components/ProgramsList";
import OurPrograms from "./components/OurPrograms";
import Authintication from './components/Authintication';
import ProgramOne from "./components/ProgramOne";
import Blogs from "./components/Blogs";
import Navbar from './components/Navbar'
import ProductList from './components/Products/ProductList'
import ProductDetail from './components/Products/ProductDetail'



function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Authintication />} />
        <Route path="/details" element={<OurPrograms/>}/>
        <Route path="/programslist" element={<ProgramsList/>}/>        
        <Route path="/program/:id" element={<ProgramOne />} />
        <Route path="/Blogs" element={<Blogs />} />
        <Route path="/ProductList" element={<ProductList />} />
        <Route path="/ProductDetail" element={<ProductDetail />} />

        
        
      </Routes>
      <Footer/>
    </Router>
  )
}

export default App;
