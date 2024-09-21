import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Authintication from './modules/Authintication/components/Authintication';


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Authintication />} />
      </Routes>
    </Router>
  )
}

export default App;
