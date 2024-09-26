import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import ProgramsList from "./components/ProgramsList";
import OurPrograms from "./components/OurPrograms";
import Authintication from './components/Authintication';
import ProgramOne from "./components/ProgramOne";
import Blogs from "./components/Blogs";
import Navbar from './components/Navbar'



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

        
      </Routes>
      <Footer/>
    </Router>
  )
}

export default App;
