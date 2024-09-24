import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import ProgramsList from "./components/ProgramsList";
import OurPrograms from "./components/OurPrograms";
import Authintication from './components/Authintication';
import ProgramOne from "./components/ProgramOne";
import Navbar from './components/Navbar'



function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Authintication />} />
        <Route path="/programslist" element={<ProgramsList/>}/>
        <Route path="/details" element={<OurPrograms/>}/>
        <Route path="/programdetails/:id" element={<ProgramOne />} />

      </Routes>
      <Footer/>
    </Router>
  )
}

export default App;
