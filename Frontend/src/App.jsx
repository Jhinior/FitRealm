import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Authintication from './components/Authintication';
import Navbar from './components/Navbar'


function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Authintication />} />
      </Routes>
    </Router>
  )
}

export default App;
